/* eslint-disable react/prop-types */
import { SearchNormal } from "iconsax-react";
import algoliasearch from 'algoliasearch/lite';
import { InstantSearch, Hits, useSearchBox, Index, useInstantSearch, Highlight, Configure } from 'react-instantsearch';
import { useState } from "react";
import { Link } from "react-router-dom";
import { AppRoutes } from "../../constants/AppRoutes";
import { truncateText } from "../../utils";
import { Img } from "react-image";
import avatar from '../../assets/user.png'
const searchClient = algoliasearch('8FN5XIJFZE', '9a3598ba0ccf3cecbe427c8821ac7204');

function User({ hit }) {

    return (
        <article className="p-2 m-2 border  dark:border-borderSecondary  cursor-pointer">
            <Link className="flex justify-start items-center gap-2 dark:text-primary text-secondary" to={`${AppRoutes.profile.baseRoute}/${hit.objectID}`}>
                {/* <p>{hit.Title}</p> */}
                <div className="w-12 h-12">
                    <Img
                        loader={<div className="w-full h-full rounded-full skeleton"></div>}
                        className="w-full h-full rounded-full object-cover"
                        src={hit['Avatar'] || avatar}
                    />
                </div>
                <Highlight attribute="Username" hit={hit} />
            </Link>
            {/* <p className="text-red-400 my-2">
                {truncateText(hit['About'], 200)}
            </p> */}
        </article>
    );
}
function Community({ hit }) {

    return (
        <article className="p-2 m-2 border  dark:border-borderSecondary  cursor-pointer">
            <Link className="flex dark:text-primary text-secondary  justify-start items-center gap-2" to={`${AppRoutes.communityDetailPage.baseRoute}/${hit.objectID}`}>
                {/* <p>{hit.Title}</p> */}
                <div className="w-12 h-12">
                    <Img
                        loader={<div className="w-full h-full rounded-full skeleton"></div>}
                        className="w-full h-full rounded-full object-cover"
                        src={hit['Community Logo URL']}
                    />
                </div>
                <Highlight attribute="Community Name" hit={hit} />
            </Link>
            <p className="text-red-400 my-2">
                {truncateText(hit['Small Description'], 200)}
            </p>
        </article>
    );
}
function GeneralPostHit({ hit }) {
    console.log(hit);
    return (
        <article className="p-2 m-2 border dark:text-primary text-secondary  dark:border-borderSecondary  cursor-pointer">
            <Link to={`${AppRoutes.postDetailPage.baseRoute}/${hit.objectID}?type=general`}>
                {/* <p>{hit.Title}</p> */}
                <Highlight attribute="Title" hit={hit} />
            </Link>
            <p className="text-red-400">
                {truncateText(hit.Description, 50)}
            </p>
        </article>
    );
}

function CustomSearchBox({ value, setValue }) {
    const { refine } = useSearchBox();
    const { status } = useInstantSearch();
    const isSearchStalled = status === 'stalled';

    function handleInputChange(event) {
        const newQuery = event.currentTarget.value;
        setValue(newQuery);
        refine(newQuery);
    }

    return (
        <div className="border-2 focus-within:border-blAccent dark:focus-within:border-accent w-full h-full flex items-center justify-start gap-2 text-textSecondary dark:text-textPrimary border-borderPrimary dark:border-borderSecondary p-2 rounded-2xl">
            <SearchNormal size="25" className="dark:text-textPrimary text-textSecondary" />
            <input
                className="bg-transparent border-none outline-none w-full h-full"
                ref={null}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                placeholder="Search for people, posts, and community"
                spellCheck={false}
                maxLength={512}
                type="search"
                value={value}
                onChange={handleInputChange}
                autoFocus
            />
            {isSearchStalled && <span>Searching…</span>}
        </div>
    );
}

export const SearchInput = ({ value, setValue }) => {
    const [showSearchResults, setShowSearchResults] = useState(false);

    function handleMouseLeave() {
        setShowSearchResults(false);
    }

    function handleMouseEnter() {
        setShowSearchResults(true);
    }

    return (
        <div className="relative" onMouseLeave={handleMouseLeave} onMouseEnter={handleMouseEnter}>
            <InstantSearch searchClient={searchClient} indexName="posts" insights>
                <div >
                    <CustomSearchBox value={value} setValue={setValue} />
                </div>
                <Configure hitsPerPage={5} />
                {showSearchResults && (
                    <div className="border   dark:border-borderSecondary  bg-lightGrey dark:bg-secondary overflow-scroll w-full h-[400px] absolute z-10  shadow-lg rounded-lg">
                        <Index indexName="posts">
                            <h1 className="m-2 p-2 dark:text-accent text-blAccent font-extrabold text-xl">
                                General Posts
                            </h1>
                            <div className="h-auto overflow-scroll">

                                <Hits hitComponent={GeneralPostHit} />
                            </div>
                        </Index>

                        <Index indexName="community">
                            <h1 className="m-2 p-2 dark:text-accent text-blAccent font-extrabold text-xl">
                                Communities
                            </h1>
                            <div className="overflow-scroll h-auto">
                                <Hits hitComponent={Community} />
                            </div>
                        </Index>

                        <Index indexName="users">
                            <h1 className="m-2 p-2 dark:text-accent text-blAccent font-extrabold text-xl">
                                Users
                            </h1>
                            <div className="overflow-scroll h-auto">
                                <Hits hitComponent={User} />
                            </div>
                        </Index>
                    </div>
                )}
            </InstantSearch>

        </div>
    );
}
