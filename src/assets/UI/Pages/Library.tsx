import Loading from "../Components/Loading";
import Card from "../Components/Card";
import Button from "../Components/Button";
import Icon from "../Components/Icon";
import Editable from "../Components/Editable";
import Error from "../Components/Error";
import Modal from "../Components/Modal";
import TextToSpeach from "../Components/TextToSpeach";

import { Route, Routes, useParams } from "react-router-dom";
import { useState, useEffect, useMemo, type ChangeEvent, type FormEvent } from "react";
import { useFetch } from "../../Hooks/useFetch";
import { useForm } from "../../Hooks/useForm";
import { useUpload } from "../../Hooks/useUpload";
import { type Profiles } from "./Dashboard";

import Shortcut from "../../Utils/Shortcut";
import { Sanitizer, Slug } from "../../Utils/Sanitizer";
import { type DocxSettings, generateAndDownloadDocx } from "../../Utils/Save";

interface BookProps {
    book_id: string;
    created_at: string;
    index: number;
    title: string;
    cover: string;
    synopsys: string;
    genres: string[];
    link: string;
}
interface ChapterProps {
    index: number;
    chapter_id: string;
    book_id: string;
    name: string;
    content: string;
    status: "draft" | "finish";
    word: number;
}
interface ExportModalProps {
    bookTitle: string;
    chapters: ChapterProps[];
    onClose: () => void;
}

function Export({ bookTitle, chapters, onClose }: ExportModalProps) {
    const [exporting, setExporting] = useState<boolean>(false)
    const [settings, setSettings] = useState<DocxSettings>({
        fontFamily: "Times New Roman",
        fontSizePt: 12,
        lineSpacing: 1.5,
        paragraphSpacingAfterPt: 6,
        marginTopCm: 3,
        marginBottomCm: 4,
        marginLeftCm: 4,
        marginRightCm: 3,
        showPageNumbers: true,
    })

    const handleExport = async () => {
    setExporting(true);
    try {
        await generateAndDownloadDocx(bookTitle, chapters, settings);
        onClose();
    } catch (err) {
        console.error("Gagal mengunduh file docx:", err);
        alert("Terjadi kesalahan saat membuat file .docx");
    } finally {
        setExporting(false);
    }}

    return <section className="center w-screen h-screen fixed top-0 left-0 bg-black/75 inset-0 z-100">
        <div className="w-[50%] bg-(--primary) rounded-xl shadow-xl flex flex-col p-4 gap-4">

            <div className="w-full h-16 flex gap-2">
                <div className="w-[50%] flex flex-col">
                    <span className="text-sm opacity-50">Font Family</span>
                    <select value={settings.fontFamily} onChange={(e) => setSettings({ ...settings, fontFamily: e.target.value })}>
                        <option value="Times New Roman">Times New Roman</option>
                        <option value="Calibri">Calibri</option>
                        <option value="Arial">Arial</option>
                        <option value="Garamond">Garamond</option>
                        <option value="Courier New">Courier New</option>
                    </select>
                </div>
                <div className="w-[50%] flex flex-col">
                    <span className="text-sm opacity-50">Font Size</span>
                    <input type="number" value={settings.fontSizePt} onChange={(e) => setSettings({ ...settings, fontSizePt: Number(e.target.value)})}/>
                </div>
            </div>

            <div className="w-full h-16 flex gap-2">
                <div className="w-[50%] flex flex-col">
                    <span className="text-sm opacity-50">Line Spacing</span>
                    <select value={settings.lineSpacing} onChange={(e) => setSettings({ ...settings, lineSpacing: Number(e.target.value)})}>
                        <option value={1.0}>1.0 (Single)</option>
                        <option value={1.15}>1.15</option>
                        <option value={1.5}>1.5 Line</option>
                        <option value={2.0}>2.0 (Double)</option>
                    </select>
                </div>
                <div className="w-[50%] flex flex-col">
                    <span className="text-sm opacity-50">Paragraph Size</span>
                    <input type="number" value={settings.paragraphSpacingAfterPt} onChange={(e) => setSettings({ ...settings, paragraphSpacingAfterPt: Number(e.target.value)})}/>
                </div>
            </div>

            <div className="w-full h-16 flex gap-4">
                <div className="w-[25%] flex flex-col">
                    <span className="text-sm opacity-50">Top</span>
                    <input type="number" value={settings.marginTopCm} onChange={(e) => setSettings({ ...settings, marginTopCm: Number(e.target.value)})}/>
                </div>
                <div className="w-[25%] flex flex-col">
                    <span className="text-sm opacity-50">Right</span>
                    <input type="number" value={settings.marginRightCm} onChange={(e) => setSettings({ ...settings, marginRightCm: Number(e.target.value)})}/>
                </div>
                <div className="w-[25%] flex flex-col">
                    <span className="text-sm opacity-50">Bottom</span>
                    <input type="number" value={settings.marginBottomCm} onChange={(e) => setSettings({ ...settings, marginBottomCm: Number(e.target.value)})}/>
                </div>
                <div className="w-[25%] flex flex-col">
                    <span className="text-sm opacity-50">Left</span>
                    <input type="number" value={settings.marginLeftCm} onChange={(e) => setSettings({ ...settings, marginLeftCm: Number(e.target.value)})}/>
                </div>
            </div>

            <div className="w-full h-16">
                <div className="w-full center gap-4">
                    <span className="text-sm opacity-50">Page Number</span>
                    <input type="checkbox" checked={settings.showPageNumbers} onChange={(e) => setSettings({ ...settings, showPageNumbers: e.target.checked})}/>
                </div>
            </div>

            <div className="flex gap-4">
                <Button label="Close Export" onClick={onClose} type="warning" use="button" className="w-[50%] rounded-md">Cancel</Button>
                <Button label="Confirm Export" onClick={handleExport} type="normal" use="button" className="w-[50%] rounded-md">{exporting?"Exporting...":"Export"}</Button>
            </div>
        </div>
    </section>
}

function Book({props, profiles}: {props: BookProps, profiles: Profiles}) {
    const { data: chapters, isLoading, error } = useFetch<ChapterProps>("chapters", 'book_id, word, status, name, content', {
        eq: {book_id: props.book_id},
        ascend: {
            col: "created_at",
            order: true
        }
    });

    const [showModal, setShowModal] = useState<boolean>(false)
    const [showMenu, setShowMenu] = useState<boolean>(false)
    const [showExport, setShowExport] = useState<boolean>(false)

    const wordAverage = () => {
        const words = chapters.map(item => item.word)
        return Math.round(words.reduce((a, b) => a + b, 0) / words.length)
    }

    const bookStatus = `${chapters.length || "..."} Total Chapters | ${chapters.filter(item => item.status==="finish").length || "..."} Finished | ${chapters.filter(item => item.status==="draft").length || "..."} On Draft | ${wordAverage()} Word Avrg(Est.)`

    const [mode, setMode] = useState<boolean>(false);
    const { onSubmit, onDelete, setValue, getValue } = useForm({inputs:['title', 'synopsys', 'link', 'cover'], enp:'book', id:props?.book_id});
    const { upload, uploading } = useUpload("book-cover");

    const [uploadedCover, setUploadedCover] = useState<string | null>(null);
    const currentCover = uploadedCover ?? props.cover ?? "";

    const handleCoverUpload = async (e: ChangeEvent<HTMLInputElement> | string | boolean) => {
        if (!e || typeof e !== 'object' || !('target' in e) || !e.target.files) return;

        const url = await upload(e as ChangeEvent<HTMLInputElement>);
        if (url) {
            setUploadedCover(url);
            setValue('cover', url);
            setValue('title', props.title);
            setValue('synopsys', props.synopsys);
            setValue('link', props.link);
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const res = await onSubmit(e);
        if (res?.ok) {
            setMode(false);
            setUploadedCover(null);
        }
    };

    if (isLoading) return <Loading message="Chapter" />
    if (error || !chapters) return <Error err={error || "Chapters not found!"}/>
    return <Card>
        <form onSubmit={handleSubmit} className="h-full flex gap-4 relative">
            <div>
                <Editable type="upload" editMode={mode} onChange={handleCoverUpload} uploading={uploading}>
                    {props.cover==null||props.cover==""?
                        <div className="w-full h-full bg-(--accent) rounded-md"/>:
                        <img src={currentCover} alt={props.title} className="w-full h-52 object-fit rounded-lg" />
                    }
                </Editable>
            </div>

            <input type="hidden" name="cover" value={currentCover} />
            
            <div className="flex flex-col gap-2 w-[60%]">
                <Editable type="input" name='title' text={(getValue('title') as string) ?? props.title} onChange={(v)=>setValue('title', v)} editMode={mode} className='text-2xl font-black capitalize w-full'>
                    <h2 className="text-2xl font-black capitalize">{(getValue('title') as string) ?? props.title}</h2>
                </Editable>
                <Editable type="input" name='link' text={(getValue('link') as string) ?? props.link} onChange={(v)=>setValue('link', v)} editMode={mode} className='text-xl font-black capitalize w-full'> </Editable>
                <p>{bookStatus}</p>
                <Editable type="textarea" name='synopsys' text={(getValue('synopsys') as string) ?? props.synopsys} onChange={(v)=>setValue('synopsys', v)} editMode={mode} className='w-full text-justify opacity-50"'>
                    <p className="w-full text-justify opacity-50">{(getValue('synopsys') as string) ?? props.synopsys}</p>
                </Editable>
            </div>
            {showModal && <Modal message={`Delete ${props.title}?`} type="warning" onConfirm={async () => { await onDelete(); }} onClose={() => setShowModal(false)}/>}
            <div className='flex w-full h-12 justify-end gap-2 absolute bottom-0'>
                {mode ? <>
                    <Button label={"Cancel Edit "+props.title} type='warning' use="button" className='rounded-md w-12' onClick={() => {
                        setMode(false);
                        setUploadedCover(null);
                        setValue('title', props.title);
                        setValue('synopsys', props.synopsys);
                        setValue('link', props.link);
                        setValue('cover', props.cover);
                    }}>
                        <Icon type="normal" use="cancel" width={3} color="white"/>
                    </Button>
                    <Button label={"Submit Edit "+props.title} type='normal' use="submit" className='rounded-md w-12'>
                        <Icon type="normal" use="submit" width={3} color="white" fill/>
                    </Button>
                </> : <>
                    <div className="flex relative gap">
                        <Button label="" onClick={() => setShowMenu(prev => !prev)} type='normal' use='button' className='rounded-md w-12'>
                            <Icon type="normal" use="burger" width={3} color="var(--text)"/>
                        </Button>
                        {showMenu && <div className="absolute z-50 top-0 -left-24 p-4 gap-4 shadow-md flex flex-col bg-(--bg) rounded overflow-hidden text-center">
                            <Button label={"Read "+props.title} type='custom' use='url' target={props.link} className='hover:brightness-110'>Read!</Button>
                            <Button label={"Open "+props.title} type='custom' use='link' target={Slug(props.title)} className='hover:brightness-110'>Chapters</Button>
                            <Button label={"Edit "+props.title} type='custom' use='button' onClick={()=>setMode(true)} className='hover:brightness-110'>Edit</Button>
                            <Button label={"Export "+props.title} onClick={() => setShowExport(true)} disabled={profiles?.plan === "free"} type='custom' use='button' className={profiles?.plan === "free"?"opacity-75":"hover:brightness-125"}>Export</Button>
                            <Button label={"Delete "+props.title} onClick={() => setShowModal(true)} type='custom' use='button' className='hover:brightness-110 text-(--warning)'>Delete</Button>
                        </div>}
                    </div>
                </>}
            </div>
        </form>
        {showExport && <Export bookTitle={props.title} chapters={chapters.filter(item => item.status === "finish")} onClose={() => setShowExport(false)}/>}
    </Card>
}

function Chapter({name, index, status, chapter_id}: {name: string, index: number, status: string, chapter_id: string}) {
    const state = status === "finish" ? true : false 
    const {onDelete} = useForm({inputs:[], enp:"chapter", id:chapter_id})
    const [showModal, setShowModal] = useState<boolean>(false)

    return <div className="flex items-center w-full h-16 bg-(--primary) rounded-xl overflow-hidden">
        <Button label={"Open Chapter "+index} type="normal" use="link" target={Slug(name)} className="w-[10%] h-full bg-(--accent) center text-4xl font-black">
            <p className="text-4xl">{index}</p>
        </Button>
        <div className="flex justify-between items-center w-[90%] h-full px-2">
            <h2 className="text-2xl">{name}</h2>
            {showModal && <Modal message={`Delete ${name}?`} type="warning" onConfirm={async () => { await onDelete(); }} onClose={() => setShowModal(false)}/>}
            <div className="flex h-12 gap-2">
                <span className={`w-24 h-full inline-block center border-2 rounded-2xl transition-all duration-150 hover:brightness-125 ${state?"bg-(--success)/50 border-(--success)":"bg-(--warning)/50 border-(--warning)"}`}>{status.toUpperCase()}</span>
                <Button label={"Delete "+name} onClick={() => setShowModal(true)} type='warning' use="button" target={Slug(name)} className='rounded-xl w-12'>
                    <Icon type="online" use="trash" width={3} color="white" fill/>
                </Button>
            </div>
        </div>
    </div>
}

function ChapterPage({props,loading}: {props: ChapterProps[], loading: boolean}) {
    const { slug } = useParams<{ slug: string }>()
    const chapter = props.find((item) => Slug(item.name) === slug)
    
    const { result, onSubmit, setValue, getValue } = useForm({inputs:['name','content','status','word'], enp:"chapter", id:chapter?.chapter_id||""})

    const [mode, setMode] = useState<boolean>(false)

    const htmlContent = (getValue('content') as string) ?? ""
    const wordCount = useMemo(() => {
        const doc = htmlContent ? new DOMParser().parseFromString(htmlContent, 'text/html') : new DOMParser().parseFromString('', 'text/html');
        const plainText = doc.body.textContent || "";
        const pureText = Sanitizer(plainText);
        const words = pureText ? pureText.split(/\s+/) : [];

        return words.length
    }, [htmlContent])
    
    useEffect(()=>{
        if (!chapter) return
        setValue('name', chapter.name)
        setValue('content', chapter.content)
        setValue('status', chapter.status)
        setValue('word', chapter.word)
    }, [chapter, setValue])

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const res = await onSubmit(e);
        if (res?.ok) setMode(false);
    }

    Shortcut({ctrl: true, key: "s"}, () => {
        const form = document.querySelector('form');
        if (form) form.requestSubmit();
    })

    if (loading && result.loading) return <Loading message="Chapter" />
    if (result.error || !chapter) return <Error err={result.error || "Chapters not found!"}/>
    return <form onSubmit={handleSubmit} className="w-full h-full p-4 flex flex-col gap-4">
        <input type="hidden" name="content" value={htmlContent}/>
        <input type="hidden" name="word" value={wordCount}/>
        <Editable type="input" name="name" editMode={mode} text={(getValue('name') as string) ?? chapter.name} onChange={(v)=>setValue('name', v)} className="text-4xl font=bold">
            <h2 className="text-4xl font=bold">{(getValue('name') as string) ?? chapter.name} - {chapter.word}</h2>
        </Editable>
        {!mode && <TextToSpeach text={Sanitizer(chapter?.content)} isLoadingText={loading}/>}
        <Editable type="richedit" text={htmlContent} onChange={(html) => setValue("content", html)} editMode={mode} onClick={() => setMode(true)}/>
        {mode? <>
            <span className="text-xs text-neutral-500 mt-2 block">Pilih status</span>
            <Editable type="option" list={["draft", "finish"]} name="status" editMode={mode} onChange={(v)=>setValue('status', v)} text={(getValue('status') as string) ?? chapter.status} className="bg-(--primary) p-2 rounded-xl"/>

            <div className="flex h-12 justify-end gap-2">
                <Button label="Cancel Edit" type="warning" use="button" className='rounded-md w-12' onClick={()=>{
                    setMode(false)
                    setValue('name', chapter.name)
                    setValue('content', chapter.content)
                }}>
                    <Icon type="normal" use="cancel" width={6} color="var(--text)"/>
                </Button>
                <Button label="Submit" type='normal' use='submit' className='rounded-md w-12'>
                    <Icon type="normal" use="submit" width={3} fill color="var(--text)"/>
                </Button>
            </div>
        </>
        : <div>
            <div onClick={() => setMode(true)} dangerouslySetInnerHTML={{ __html: htmlContent }} className="p-4 bg-(--primary) border hover:border-white cursor-pointer transition-all whitespace-pre-wrap leading-relaxed"/>
            <span className="text-xs text-neutral-500 mt-2 block">Klik teks untuk mengedit & meformat</span>
        </div>}
    </form>
}

function BookPage({props, profiles}: {props: BookProps[], profiles: Profiles}) {
    const { slug } = useParams<{ slug: string }>()
    const book = props.find((item) => Slug(item.title) === slug)
    
    const [pageIndex, setPageIndex] = useState<number>(1)

    const pageSize = 10;
    const from = (pageIndex - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data: chapter, isLoading, error } = useFetch<ChapterProps>("chapters", 'chapter_id', {
        eq: { book_id: book?.book_id },
    });
    const { data, counted } = useFetch<ChapterProps>("chapters", '', {
        eq: { book_id: book?.book_id },
        ascend: {
            col: "created_at",
            order: true
        },
        range: {
            from: from,
            to: to
        },
        count: "exact"
    });

    const maxChapter = profiles?.plan === "free" ? 100 : profiles?.plan === "hobbies" ? 120 : 140
    const { onCreate } = useForm({inputs:[], enp:'chapter', id:data.length > 0 ? data[0]?.chapter_id : ''})
    const handleCreate = async () => {
        if (chapter.length < maxChapter) {
            const res = await onCreate({
                book_id: book?.book_id,
                name: "New Chapter",
                content: "Write Story"
            })
            if(res.ok) console.log("Created Succesed!")
        } else alert("Your Reach Maximum Chapter!")
    } 

    const pageLength = Math.ceil((counted ?? 0) / 10);
    if (isLoading) return <Loading message="Chapters" />
    if (error || !book) return <Error err={error || "Book not found!"}/>
    return <Routes>
        <Route path="/" element={<div className="w-full p-4 flex flex-col gap-2">
            <div className="flex gap-2 flex-col items-center sticky top-0 left-[50%] translate-x-[-50%] z-10 w-fit">
                <div className="flex gap-2 bg-(--primary) p-2 rounded-xl">
                    {Array.from({length:pageLength}, (_,i) => <Button label={"Page "+i+1} type="custom" key={i} use="button" onClick={()=>setPageIndex(i+1)} className="w-12 h-12 border border-(--accent) rounded-full font-bold hover:bg-(--accent)">{i+1}</Button>)}
                </div>
                <span className="text-xl">{pageIndex}/{pageLength} | max. Page {chapter?.length ?? 0} / {maxChapter}</span>
            </div>
            {data?.map((item, i)=><Chapter key={i} name={item.name} index={(pageIndex - 1) * 10 + i} status={item.status} chapter_id={item.chapter_id}/>)}
            <div className="h-16 w-full bg-(--primary) shadow-2xl rounded-xl overflow-hidden">
                <form onClick={handleCreate} className="h-full flex flex-col hover:bg-(--accent) center p-4 transition-colors transition-300">
                    <span className="text-white text-2xl"><code>+</code> Create New Chapter</span>
                </form>
            </div>
        </div>}/>
        <Route path=":slug" element={<ChapterPage props={data} loading={isLoading}/>}/>
    </Routes>
}

export default function Library({project_id, profiles}: {project_id: string, profiles: Profiles}) {
    const { data, isLoading, error } = useFetch<BookProps>("books", '', {
        eq: {project_id: project_id}
    });

    const maxBook = profiles?.plan === "free" ? 2 : profiles?.plan === "hobbies" ? 5 : 10

    const { onCreate } = useForm({inputs:[], enp:"book", id:data.length > 0 ? data[0]?.book_id : ''})
    const handleCreate = async () => {
        if (data.length < maxBook) {
            const res = await onCreate({
                project_id: project_id,
                title: "Book Title",
                synopsys: "Write Synopsys",
                link: "Insert Link"
            })
            if(res.ok) console.log("Created Succesed!")
        } else alert("Your Reach Maximum Book!")
    } 

    if (isLoading) return <Loading message="Books" />
    if (error || !data) return <Error err={error || "Books not found!"}/>
    return <section className="w-full h-full">
        <Routes>
            <Route path="/" element={<div className="grid gap-4 lg:grid-cols-1 p-4 relative">
                {data.map((item) => <Book key={item.book_id} props={item} profiles={profiles}/>)}
                <div className="h-full w-full bg-(--primary) shadow-2xl rounded-2xl overflow-hidden">
                    <form onClick={handleCreate} className="min-h-60 flex flex-col hover:bg-(--accent) center p-4 transition-colors transition-300">
                        <span>{data.length} / {maxBook}</span>
                        <span className="text-white text-2xl"><code>+</code> Create New Book</span>
                    </form>
                </div>
            </div>} />
            <Route path=":slug/*" element={<BookPage props={data} profiles={profiles}/>}/>
        </Routes>
    </section>
}