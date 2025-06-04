import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { format } from 'date-fns';
import { Loader2, AlertTriangle } from 'lucide-react';
import { Article } from '../types/Article';
import { fetchArticleBySlug, getArticleCover, getArticleCategory } from '../services/service';

interface TextNode {
    type: 'text';
    text: string;
}

interface ParagraphNode {
    type: 'paragraph';
    children: TextNode[];
}

type ContentNode = ParagraphNode;

const ArticlePage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const [article, setArticle] = useState<Article | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadArticle = async () => {
            if (!slug) {
                setError('Invalid article slug.');
                setLoading(false);
                return;
            }
            try {
                const fetchedArticle = await fetchArticleBySlug(slug);
                setArticle(fetchedArticle);
                setLoading(false);
            } catch (err: any) {
                setError('Failed to load article. Please try again.');
                setLoading(false);
            }
        };

        loadArticle();
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="inline-block animate-spin text-blue-500 h-8 w-8 mb-2" />
                    <p className="text-gray-600 dark:text-gray-400">Loading article...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <AlertTriangle className="inline-block text-red-500 h-8 w-8 mb-2" />
                    <p className="text-red-600 dark:text-red-400">{error}</p>
                </div>
            </div>
        );
    }

    if (!article) {
        return <div className="text-center">Article not found</div>;
    }

    const cover = getArticleCover(article);
    const category = getArticleCategory(article);
    const formattedDate = format(new Date(article.publishedAt), 'MMM dd, yyyy - hh:mm a');

    const renderContent = (markdownContent: any[] | null | undefined) => {
        if (!markdownContent) return null;

        return markdownContent.map((node: ContentNode, index: number) => {
            if (node.type === 'paragraph' && node.children) {
                return (
                    <p key={index}>
                        {node.children.map((child: TextNode, childIndex: number) => (
                            <span key={childIndex}>{child.text}</span>
                        ))}
                    </p>
                );
            }
            return null;
        });
    };

    return (
        <main className="container mx-auto px-4">
            <article className="max-w-3xl mx-auto bg-white dark:bg-gray-900 rounded-xl shadow-sm p-6">
                <header className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">{article.title}</h1>


                    <div className="flex flex-wrap items-center justify-between text-sm text-gray-600 dark:text-gray-400 mt-5 mb-4">
                        <span className="bg-blue-100 text-blue-800 font-medium px-2.5 py-0.5 rounded">{category}</span>
                        <span>{formattedDate}</span>
                    </div>

                    <div className="w-full h-60 md:h-72 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden mb-4">
                        <img
                            src={cover}
                            alt={article.title}
                            className="w-full h-full"
                        />
                    </div>

                    <div className="flex justify-between items-center flex-wrap gap-2">
                        <p className="text-gray-600 dark:text-gray-400">
                            {article.description}
                        </p>
                        <p className="text-base italic font-serif text-gray-700 dark:text-gray-300 whitespace-nowrap">
                            By {article.author.name}
                        </p>
                    </div>


                </header>

                <section className="prose dark:prose-invert max-w-none prose-img:rounded-md prose-a:text-blue-600 dark:prose-a:text-blue-400">
                    {typeof article.markdownContent === 'string' ? (
                        <ReactMarkdown>{article.markdownContent}</ReactMarkdown>
                    ) : article.markdownContent ? (
                        renderContent(article.markdownContent)
                    ) : typeof article.textContent === 'string' ? (
                        <p>{article.textContent}</p>
                    ) : (
                        renderContent(article.textContent)
                    )}
                </section>

            </article>
        </main>
    );
};

export default ArticlePage;
