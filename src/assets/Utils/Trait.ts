export default function Trait(stat: number[]) {
    const values = Array.isArray(stat) ? stat : []
    const traits: string[] = []

    const visual = Number(values[0] ?? 0)
    const morality = Number(values[1] ?? 0)
    const psychology = Number(values[2] ?? 0)
    const combat = Number(values[3] ?? 0)
    const social = Number(values[4] ?? 0)
    const intelligence = Number(values[5] ?? 0)

    if (visual >= 3) traits.push("Attractive")

    if (morality < 3) traits.push("Evillious")
    else if (morality === 3) traits.push("Good")
    else if (morality > 3) traits.push("Nice")
    if (morality < 3 && combat > 3) traits.push("Dangerous")

    if (psychology < 3) traits.push("Cold")
    else if (psychology === 3) traits.push("Mentally Stable")
    else if (psychology > 3) traits.push("Mentally Unstable")

    if(combat>=3 && social>=3) traits.push("Brave")
    if(combat<3) traits.push("Weak")
    
    if (social < 3) traits.push("Introvert")
    else traits.push("Extrovert")

    if(intelligence<3) traits.push("Dumb")
    if(intelligence===3) traits.push("Smart")
    if(intelligence>3) traits.push("Jenius")

    return traits
}
