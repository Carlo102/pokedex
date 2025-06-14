import { useState } from "react"
import { first151Pokemon, getFullPokedexNumber } from "../util"

export function SideNav(props) {
    let { selectedPokemon, setSelectedPokemon, handleCloseMenu,
        showSideMenu } = props
    let [searchValue, setSearchValue] = useState('')
    let filteredPokemon = first151Pokemon.filter((ele, eleIndex) => {
        
        if ((getFullPokedexNumber(eleIndex)).includes
    (searchValue)) { return true }

        if (ele.toLowerCase().includes(searchValue.toLowerCase())) { return true }

        return false
    })

    return (
        <nav className={' ' + (!showSideMenu ? " open" : '')}>
            <div className={"header " + (!showSideMenu ? " open" : '')}>
                <button onClick={handleCloseMenu}
                className="open-nav-button">
                    <i className="fa-solid fa-arrow-left"></i>
                </button>
                <h1 className="text-gradient">Pokedex</h1>

            </div>
            <input type="text" placeholder="Search" value={searchValue} onChange={(e) => {
                setSearchValue(e.target.value)

            }} />
            {filteredPokemon.map((pokemon, pokemonIndex) => {

                let truePokedexNumber = first151Pokemon.indexOf(pokemon)

                return (

                    <button onClick={() => {
                        setSelectedPokemon(truePokedexNumber)
                        handleCloseMenu()
                    }} key={pokemonIndex} className={'nav-card ' +
                        (pokemonIndex === selectedPokemon ? 'nav-card-selected' : ' ')}>

                        <p>{pokemon}</p>
                        <p>{getFullPokedexNumber(truePokedexNumber)}</p>
                    </button>
                )
            })}
        </nav>
    )
}