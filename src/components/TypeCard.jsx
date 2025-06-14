import { pokemonTypeColors } from "../util"

export function TypeCard(props) {
    let { type } = props

    return (
        <div className="type-tile" style={{
            color: pokemonTypeColors?.
            [type]?.color, background: pokemonTypeColors?.[type]?.background}} >
                <p>{type}</p>
            
        </div >
    )
}