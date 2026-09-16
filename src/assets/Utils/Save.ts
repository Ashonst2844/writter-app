import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Footer, PageNumber, PageBreak } from "docx";
import { saveAs } from "file-saver"

export interface Chapters {
    chapter_id: string;
    name: string;
    content: string;
}

export interface DocxSettings {
    fontFamily: string;
    fontSizePt: number;
    lineSpacing: number;
    paragraphSpacingAfterPt: number;
    marginTopCm: number;
    marginBottomCm: number;
    marginLeftCm: number;
    marginRightCm: number;
    showPageNumbers: boolean;
}

const cmToTwip = (cm: number) => Math.round(cm * 567.05);
const ptToHalfPt = (pt: number) => Math.round(pt * 2);
const ptToTwip = (pt: number) => Math.round(pt * 20);

function parseContentToParagraphs(contentHtml: string, settings: DocxSettings): Paragraph[] {
    const parser = new DOMParser();
    const doc = parser.parseFromString(contentHtml || "", "text/html");
    const paragraphs: Paragraph[] = [];

    const elements = Array.from(doc.body.children);

    if (elements.length === 0) {
        const lines = (doc.body.textContent || "").split("\n").filter((l) => l.trim() !== "");
        return lines.map(line => new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            children: [
                new TextRun({
                    text: line,
                    font: settings.fontFamily,
                    size: ptToHalfPt(settings.fontSizePt),
                }),
            ],
            spacing: {
                line: Math.round(240 * settings.lineSpacing),
                after: ptToTwip(settings.paragraphSpacingAfterPt),
            },
            })
        );
    }

    elements.forEach((el) => {
        const text = el.textContent || "";
        if (!text.trim()) return;

        let isHeading = false;
        let headingLevel: typeof HeadingLevel[keyof typeof HeadingLevel] | undefined;

        if (el.tagName === "H1") {
            isHeading = true;
            headingLevel = HeadingLevel.HEADING_1;
        } else if (el.tagName === "H2") {
            isHeading = true;
            headingLevel = HeadingLevel.HEADING_2;
        }

        paragraphs.push(
        new Paragraph({
            heading: headingLevel,
            alignment: isHeading ? AlignmentType.CENTER : AlignmentType.JUSTIFIED,
            children: [
            new TextRun({
                text: text,
                font: settings.fontFamily,
                size: isHeading
                ? ptToHalfPt(settings.fontSizePt + 4)
                : ptToHalfPt(settings.fontSizePt),
                bold: isHeading || el.tagName === "B" || el.tagName === "STRONG",
                italics: el.tagName === "I" || el.tagName === "EM",
            }),
            ],
            spacing: {
            line: Math.round(240 * settings.lineSpacing),
            after: ptToTwip(settings.paragraphSpacingAfterPt),
            },
        })
        );
    });

    return paragraphs;
}

export async function generateAndDownloadDocx(bookTitle: string, chapters: Chapters[], settings: DocxSettings) {
    const docChildren: Paragraph[] = [];

    chapters.forEach((chapter, index) => {
        docChildren.push(
        new Paragraph({
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
            spacing: {
            before: ptToTwip(12),
            after: ptToTwip(24),
            },
            children: [
                new TextRun({
                    text: chapter.name || `Chapter ${index} : ${chapter.name}`,
                    font: settings.fontFamily,
                    size: ptToHalfPt(settings.fontSizePt + 6),
                    bold: true,
                }),
            ],
        })
    );

    const contentParagraphs = parseContentToParagraphs(chapter.content, settings);
    docChildren.push(...contentParagraphs);

    if (index < chapters.length - 1) {docChildren.push(new Paragraph({ children: [new PageBreak()] }));}
    });

    const doc = new Document({
        sections: [
        {
            properties: {
                page: {
                    margin: {
                    top: cmToTwip(settings.marginTopCm),
                    bottom: cmToTwip(settings.marginBottomCm),
                    left: cmToTwip(settings.marginLeftCm),
                    right: cmToTwip(settings.marginRightCm),
                    },
                },
            },
            footers: settings.showPageNumbers
            ? {
                default: new Footer({
                    children: [
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                        new TextRun({
                            children: [PageNumber.CURRENT],
                            font: settings.fontFamily,
                            size: ptToHalfPt(10),
                        }),
                        ],
                    }),
                    ],
                }),
                }
            : undefined,
            children: docChildren,
        },
        ],
    });

    const blob = await Packer.toBlob(doc);
    const fileName = `${bookTitle.toLowerCase().replace(/\s+/g, "-")}-export.docx`;
    saveAs(blob, fileName);   
}