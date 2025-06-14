import { useEffect, useState } from "react"
import { getFullPokedexNumber, getPokedexNumber } from "../util"
import { TypeCard } from "./TypeCard"
import { Modal } from "./Modal"
export function PokeCard(props) {
    let { selectedPokemon } = props
    let [data, setData] = useState(null)
    let [loading, setLoading] = useState(false)
    let [skill, setSkill] = useState(null)
    let [loadingSkill, setLoadingSkill] = useState(false)

    let { name, height, abilities, stats, types, moves, sprites } =
        data || {}

    let imgList = Object.keys(sprites || {}).filter(val => {
        if (!sprites[val]) { return false }
        if (['versions', 'other'].includes(val)) { return false }
        return true
    })

    async function fetchMoveData (move, moveUrl) {
        if (loadingSkill || !localStorage || !moveUrl) { return }

        let c = {}
        if (localStorage.getItem('pokemon-moves')) {
            c = JSON.parse(localStorage.getItem('pokemon-moves'))
        }

        if (move in c) {
            setSkill(c[move])
            console.log('Found move in cache')
            return
        }

        try {
            setLoadingSkill(true)
            let res = await fetch(moveUrl)
            let moveData = await res.json()
            console.log('Fetched move from API', moveData)
            let description = moveData?. flavor_text_entries.filter
            (val => {
                return val.version_group.name = 'firered-leafgreen'

            }) [0]?.flavor_text

            let skillData = {
                name: move,
                description
            }

            setSkill(skillData)
            c[move] = skillData
            localStorage.setItem('pokemon-moves', JSON.stringify(c))

        } catch (err) {
            console.log(err)
        } finally {
            setLoadingSkill(false)

        }
    }

    useEffect(() => {

        if (loading || !localStorage) { return }

        let cache = {}
        if (localStorage.getItem('pokedex')) {
            cache = JSON.parse(localStorage.getItem('pokedex'))
        }

        if (selectedPokemon in cache) {

            setData(cache[selectedPokemon])
            console.log('Found pokemon in cache')
            return
        }

        async function fetchPokemonData() {
            setLoading(true)

            try {
                let baseUrl = 'https://pokeapi.co/api/v2/'
                let suffix = 'pokemon/' + getPokedexNumber(selectedPokemon)
                let finalUrl = baseUrl + suffix
                let res = await fetch(finalUrl)
                let pokemonData = await res.json()
                setData(pokemonData)
                console.log(pokemonData)
                cache[selectedPokemon] = pokemonData
                localStorage.setItem('pokedex', JSON.stringify(cache))
            } catch (err) {
                console.log(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchPokemonData()
    }, [selectedPokemon])

    if (loading || !data) {
        return (
            <div>
                <h4>loading...</h4>
            </div>
        )
    }
    return (
        <div className='poke-card'>
            {skill && (
                
                <Modal handleCloseModal={() => { setSkill(null) }}>
                <div>
                    <h6>Name</h6>
                    <h2>{skill.name.replaceAll('-',' ')}</h2>
                </div>
                <div>
                    <h6>Description</h6>
                    <p>{skill.description}</p>
                </div>

            </Modal>)}

            <div>
                <h4>{getFullPokedexNumber(selectedPokemon)}</h4>
                <h2>{name}</h2>
            </div>
            <div className='type-container'>
                {types.map((typeObj, typeIndex) => {
                    return (

                        <TypeCard key={typeIndex} type={typeObj?.type?.name} />


                    )
                })}

            </div>
            <img className='default-img' src={'/pokemon/' +
                getFullPokedexNumber(selectedPokemon) + '.png'} alt={`${name}-large-img`} />
            <div className='img-container'>
                {imgList.map((spriteUrl, spriteIndex) => {
                    let imgUrl = sprites[spriteUrl]
                    return (
                        <img key={spriteIndex} src={imgUrl} alt={`${name}-img-${spriteUrl}`} />
                    )
                })}
            </div>

            <h3>Stats</h3>
            <div className='stats-card'>
                {stats.map((statObj, statIndex) => {
                    let { stat, base_stat } = statObj
                    return (
                        <div key={statIndex} className='stat-item'>
                            <p>{stat?.name.replaceAll('-', ' ')}</p>
                            <h4>{base_stat}</h4>
                        </div>
                    )
                }

                )}
            </div>
            <h3>Moves</h3>
            <div className='pokemon-move-grid'>
                {moves.map((moveObj, moveIndex) => {
                    return (
                        <button className="button-card pokemon-move"
                            key={moveIndex} onClick={() => { 
                                fetchMoveData(moveObj?.move?.name, moveObj?.
                                    move?.url)
                            }}>
                            <p>{moveObj?.move?.name.replaceAll('-', ' ')}</p>

                        </button>

                    )
                })}
            </div>

        </div>
    )
}