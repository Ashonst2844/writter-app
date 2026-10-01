import Button from "./Button"

export default function Error({err}: {err: Error | string}) {
    const message = typeof err === 'string' ? err : err.message
    return <section className="w-full h-full center flex-col gap-4">
        <h3 className="text-8xl font-bold font-mono">404</h3>
        <span>{message}!</span>
        <Button label="Back" type="custom" use="link" target=".." className="underline opacity-75 hover:opacity-100">Click Here</Button>
    </section>
}