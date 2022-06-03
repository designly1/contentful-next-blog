/* postBody.js */

import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { a11yDark } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import PopImage from './popImage';

export default function PostBody({ content }) {
    const HeaderOne = ({ children }) => <h1 className="post-heading">{children}</h1>
    const HeaderTwo = ({ children }) => <h2 className="post-heading">{children}</h2>
    const HeaderThree = ({ children }) => <h3 className="post-heading">{children}</h3>
    const HeaderFour = ({ children }) => <h4 className="post-heading">{children}</h4>
    const Table = ({ children }) => <table className="table table-striped table-bordered table-responsive-sm blog-table shadow-box">{children}</table>
    const Thead = ({ children }) => <thead className="thead-dark">{children}</thead>
    const Pre = ({ children }) => <pre className="blog-pre">{children}</pre>
    const Ul = ({ children }) => <ul className="blog-ul">{children}</ul>
    const P = ({ children }) => <p className="blog-p">{children}</p>
    const Hr = () => <hr className="blog-hr" />


    return (
        <ReactMarkdown
            className='post-markdown'
            linkTarget='_blank'
            rehypePlugins={[rehypeRaw]}
            remarkPlugins={[remarkGfm]}
            components={{
                h1: HeaderOne,
                h2: HeaderTwo,
                h3: HeaderThree,
                h4: HeaderFour,
                table: Table,
                thead: Thead,
                pre: Pre,
                ul: Ul,
                p: P,
                hr: Hr,
                code({ node, inline, className = "blog-code", children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '')
                    return !inline && match ? (
                        <SyntaxHighlighter
                            style={a11yDark}
                            language={match[1]}
                            PreTag="div"
                            {...props}
                        >
                            {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                    ) : (
                        <code className={className} {...props}>
                            {children}
                        </code>
                    )
                },
                img: ({ src, ...props }) => <PopImage src={src} {...props} />
            }}
        >
            {content}
        </ReactMarkdown>
    )
}