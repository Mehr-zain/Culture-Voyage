/* eslint-disable react/prop-types */
import { AddCircle } from "iconsax-react";

// eslint-disable-next-line react/prop-types
export const TagsInput = ({ tags = [], setTags, tagInputValue, setTagInputValue, placeholder, maxLength = 25, maxCount = 5 }) => {


    const handleInputChange = (e) => {
        setTagInputValue(e.target.value);
    };

    const addTag = () => {
        // eslint-disable-next-line react/prop-types
        if (!tags.includes(tagInputValue.trim()) && tags.length < maxCount && tagInputValue) {
            setTags([...tags, tagInputValue.trim()]);
            setTagInputValue('');
        }
    };

    const handleTagRemove = (tagToRemove) => {
        // eslint-disable-next-line react/prop-types
        setTags(tags.filter((tag) => tag !== tagToRemove));
    };

    return (
        <div className="flex flex-wrap gap-2 w-full">
            {/* eslint-disable-next-line react/prop-types */}
            {tags.map((tag) => (
                <div
                    key={tag}
                    className="dark:border-borderSecondary border-borderPrimary border-2 shadow text-textSecondary dark:text-textPrimary px-2 py-2 rounded-full cursor-pointer"
                    onClick={() => handleTagRemove(tag)}
                >
                    {tag}
                </div>
            ))}
            <div className={'flex items-center  bg-primary dark:bg-secondary  border-2 dark:border-borderSecondary border-borderPrimary rounded-lg shadow px-2 py-1'}>
                <textarea
                    maxLength={maxLength}
                    rows={1}
                    placeholder={placeholder}
                    value={tagInputValue}
                    onChange={handleInputChange}
                    className="resize-none border border-none w-full outline-none bg-transparent dark:text-textPrimary text-textSecondary "
                />
                <div className="flex items-center justify-center gap-2">
                    <div className="flex justify-end items-center mt-2">
                        <span className={`text-[#808998] ${tagInputValue.length === maxLength ? 'text-red-500' : ''}`}>
                            {tagInputValue.length}/{maxLength}
                        </span>
                    </div>
                    <AddCircle onClick={addTag} size="32" color="#FF8A65" />
                </div>
            </div>
        </div>
    );
}