import Loading from "../Components/Loading";
import Card from "../Components/Card";
import Button from "../Components/Button";
import Icon from "../Components/Icon";
import Editable from "../Components/Editable";

import { Route, Routes, useParams } from "react-router-dom";
import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import { useFetch } from "../../Hooks/useFetch";
import { useForm } from "../../Hooks/useForm";
import { useUpload } from "../../Hooks/useUpload";
import { useWordCounter } from "../../Hooks/useWordCounter";
import { supabase } from "../../Utils/supabase";

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
}

const createSlug = (text: string | null | undefined) => {
    if (!text) return "Untitled";
    return text.toLowerCase().trim().replaceAll(" ", "-");
};

function Book(props: BookProps) {
    const { data } = useFetch<ChapterProps>("chapters");
    const chapterData = data ?? [];
    const chapterCount = (chapterData.filter(item => item.book_id === props.book_id).filter(item => item.status == "finish").length)

    const slug = createSlug(props.title);
    const [mode, setMode] = useState<boolean>(false);
    const { onSubmit, onDelete, setValue, getValue } = useForm(['title', 'synopsys', 'cover'], 'book', props.book_id);
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

    return (
        <Card>
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
                    <p>{(chapterCount) || "..."} Chapters</p>
                    <Editable type="input" name='synopsys' text={(getValue('synopsys') as string) ?? props.synopsys} onChange={(v)=>setValue('synopsys', v)} editMode={mode} className='w-full text-justify opacity-50"'>
                        <p className="w-full text-justify opacity-50">{(getValue('synopsys') as string) ?? props.synopsys}</p>
                    </Editable>
                </div>
                <div className='flex w-full h-12 justify-end gap-4 absolute bottom-0'>
                    {mode ? <>
                        <Button type='warning' use="button" className='rounded-md w-12' onClick={() => {
                            setMode(false);
                            setUploadedCover(null);
                            setValue('title', props.title);
                            setValue('synopsys', props.synopsys);
                            setValue('cover', props.cover);
                        }}>
                            <Icon type="normal" use="cancel" width={3} color="white"/>
                        </Button>
                        <Button type='normal' use="submit" className='rounded-md w-12'>
                            <Icon type="normal" use="submit" width={3} color="white" fill/>
                        </Button>
                    </> : <>
                        <Button onClick={onDelete} type='warning' use='button' target={slug} className='rounded-md w-12'>
                            <Icon type="normal" use="cancel" width={3} color="white"/>
                        </Button>
                        <Button type='alternate' use='button' onClick={()=>{
                            setMode(true);
                        }} className='rounded-md w-12'>
                            <Icon type="online" use="edit" width={1} color="var(--bg)"/>
                        </Button>
                        <Button type='normal' use='link' target={slug} className='rounded-md w-25'>
                            <p>View</p>
                        </Button>
                    </>}
                </div>
            </form>
        </Card>
    );
}

function Chapter({name, index, status, chapter_id}: {name: string, index: number, status: string, chapter_id: string}) {
    const slug = createSlug(name);
    const state = status === "finish" ? true : false 
    const {onDelete} = useForm([], "chapter", chapter_id)

    return <div className="flex items-center w-full h-16 bg-(--primary) rounded-xl overflow-hidden">
        <Button type="normal" use="link" target={slug} className="w-[10%] h-full bg-(--accent) center text-4xl font-black">
            <p className="text-4xl">{index}</p>
        </Button>
        <div className="flex justify-between items-center w-[90%] h-full px-2">
            <h2 className="text-2xl">{name}</h2>
            <div className="flex h-12 gap-2">
                <span className={`w-24 h-full inline-block center border-2 rounded-2xl transition-all duration-150 hover:brightness-125 ${state?"bg-(--success)/50 border-(--success)":"bg-(--warning)/50 border-(--warning)"}`}>{status.toUpperCase()}</span>
                <Button onClick={onDelete} type='warning' use="button" target={slug} className='rounded-xl w-12'>
                    <Icon type="normal" use="cancel" width={3} color="white"/>
                </Button>
            </div>
        </div>
    </div>
}

function ChapterPage({props, loading}: {props: ChapterProps[]; loading: boolean}) {
    const { slug } = useParams<{ slug: string }>()
    const chapter = props.find((item) => createSlug(item.name) === slug)
    
    const { onSubmit, loading: formLoading, setValue, getValue } = useForm(['name','content','status'], 'chapter', chapter?.chapter_id ?? "")

    const [mode, setMode] = useState<boolean>(false)

    useEffect(()=>{
        if (!chapter) return
        setValue('name', chapter.name)
        setValue('content', chapter.content)
        setValue('status', chapter.status)
    }, [chapter, setValue])

    const htmlContent = (getValue('content') as string) ?? ""

    const {wordCount} = useWordCounter(htmlContent)

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const res = await onSubmit(e);
        if (res?.ok) setMode(false);
    }

    if (loading && formLoading) return <div className="p-4">
        <p className="opacity-50 mb-4">Memuat Chapter...</p>
    </div>;
    else if (!chapter) return <div className="p-4">
        <p className="opacity-50 mb-4">Chapter tidak ditemukan.</p>
        <Button type="normal" use="link" target="..">Back To List!</Button>
    </div>

    return <form onSubmit={handleSubmit} className="w-full h-full p-4 flex flex-col gap-4">
        <input type="hidden" name="content" value={htmlContent}/>
        <Editable type="input" name="name" editMode={mode} text={(getValue('name') as string) ?? chapter.name} onChange={(v)=>setValue('name', v)} className="text-4xl font=bold">
            <h2 className="text-4xl font=bold">{(getValue('name') as string) ?? chapter.name} - {wordCount}</h2>
        </Editable>

        <Editable type="richedit" text={htmlContent} onChange={(html) => setValue("content", html)} editMode={mode} onClick={() => setMode(true)}/>
        {mode? <>
            <span className="text-xs text-neutral-500 mt-2 block">Pilih status</span>
            <Editable type="option" list={["draft", "finish"]} name="status" editMode={mode} onChange={(v)=>setValue('status', v)} text={(getValue('status') as string) ?? chapter.status} className="bg-(--primary) p-2 rounded-xl"/>

            <div className="flex h-12 justify-end gap-2">
                <Button type="warning" use="button" className='rounded-md w-12' onClick={()=>{
                    setMode(false)
                    setValue('name', chapter.name)
                    setValue('content', chapter.content)
                }}>
                    <Icon type="normal" use="cancel" width={6} color="var(--text)"/>
                </Button>
                <Button type='normal' use='submit' className='rounded-md w-12'>
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

function BookPage({props, loading}: {props: BookProps[]; loading: boolean}) {
    const { slug } = useParams<{ slug: string }>()
    const book = props.find((item) => createSlug(item.title) === slug)

    const [chapterLoading, isLoading] = useState<boolean>(false)
    const [chapterData, setData] = useState<ChapterProps[]>([])
    const [pageIndex, setPageIndex] = useState<number>(1)
    const [chapterCount, setChapterCount] = useState<number>()

    useEffect(() => {
        let isMounted = true
        if (!book?.book_id) return
        
        const pageSize = 10;
        
        const from = (pageIndex - 1) * pageSize;
        const to = from + pageSize - 1;
        
        const fetch = async () => {
            isLoading(true)
            const { data: chapters, count, error } = await supabase
                .from('chapters')
                .select('*', { count: 'exact' })
                .eq('book_id', book?.book_id)
                .order('created_at', { ascending: true })
                .range(from, to);

            if (!isMounted) return

            if (error) {
                console.error(`Error fetching:`, error)
            } else {
                setData((chapters ?? []) as ChapterProps[])
                setChapterCount(count || 0)
            }
            isLoading(false)
        }

        fetch()

        return () => {
            isMounted = false
        }
    }, [book?.book_id, pageIndex])

    const { onCreate } = useForm([], 'chapter', "", {
        book_id: book?.book_id,
        name: "New Chapter",
        content: "Write Story"
    });

    if (loading || chapterLoading) return <Loading message="Chapter" />
    else if (!book) return <div className="p-4">
        <p className="opacity-50 mb-4">Chapter tidak ditemukan.</p>
        <Button type="normal" use="link" target="..">Back To List!</Button>
    </div>

    const pageLength = Math.ceil((chapterCount ?? 0) / 10);

    return <Routes>
        <Route path="/" element={<form className="w-full p-4 flex flex-col gap-2">
            <div className="flex gap-2 sticky top-0 left-[50%] translate-x-[-50%] z-10 bg-(--primary) p-2 rounded-xl w-fit">
                {Array.from({length:pageLength}, (_,i)=><Button type="custom" key={i} use="button" onClick={()=>setPageIndex(i+1)} className="w-12 h-12 border border-(--accent) rounded-full font-bold hover:bg-(--accent)" style={{
                    backgroundColor:pageIndex==(i+1)?"var(--accent)":"none"
                }}>{i+1}</Button>)}
            </div>
            {chapterData?.map((item, i)=><Chapter key={i} name={item.name} index={(pageIndex - 1) * 10 + i} status={item.status} chapter_id={item.chapter_id}/>)}
            <div className="h-16 w-full bg-(--primary) shadow-2xl rounded-xl overflow-hidden">
                <Button type="normal" use="button" onClick={onCreate} className="h-full w-full transition-colors transition-300">
                    <span className="text-white text-2xl"><code>+</code> Create New Chapter</span>
                </Button>
            </div>
        </form>}/>
        <Route path=":slug" element={<ChapterPage props={chapterData} loading={loading}/>}/>
    </Routes>
}

export default function Library() {
    const { data, loading } = useFetch<BookProps>("books");
    const bookData = data ?? [];

    const { onCreate } = useForm([], 'book', "", {
        title: "Book Title",
        synopsys: "Write Synopsys",
        link: "Insert Link"
    });

    if (loading) return <Loading message="Books" />

    return <section className="w-full h-full">
        <Routes>
            <Route path="/" element={<div className="grid gap-4 lg:grid-cols-1 p-4">
                {bookData.map((item) => <Book key={item.book_id} {...item} />)}
                <div className="h-full w-full bg-(--primary) shadow-2xl rounded-2xl overflow-hidden">
                    <form onClick={onCreate} className="h-full hover:bg-(--accent) center p-4 transition-colors transition-300">
                        <span className="text-white text-2xl"><code>+</code> Create New Book</span>
                    </form>
                </div>
            </div>} />
            <Route path=":slug/*" element={<BookPage props={bookData} loading={loading}/>}/>
        </Routes>
    </section>
}