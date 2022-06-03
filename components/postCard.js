/* postCard.js */

import Image from "next/image"

export default function PostCard({
    title,
    image,
    excerpt,
    authorName,
    authorAvatar,
    publishDate,
    category,
    onClick
}) {
    const featuredImage = image
        ? <Image src={image} alt="card__image" className="card__image" width={600} height={338} />
        : <></>

    return (
        <div className="post-card" onClick={onClick}>
            <div className="card__header">
                {featuredImage}
            </div>
            <div className="card__body">
                <span className="tag tag-blue">{category}</span>
                <h4>{title}</h4>
                <p>{excerpt}</p>
            </div>
            <div className="card__footer">
                <div className="user">
                    <img src={authorAvatar} alt={authorName} className="user__image" />
                    <div className="user__info">
                        <h5>{authorName}</h5>
                        <small>{publishDate}</small>
                    </div>
                </div>
            </div>
        </div>
    )
}