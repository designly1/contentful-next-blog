// next-sitemap.js

/** @type {import('next-sitemap').IConfig} */

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://example.com";

const fs = require('fs');

let postsMeta = fs.readFileSync('./public/blogPostMeta.json');
postsMeta = JSON.parse(postsMeta);

module.exports = {
    siteUrl: baseUrl,
    generateRobotsTxt: true,
    changefreq: 'monthly',
    transform: async (config, path) => {
        let additionalProps = {};

        if (path.match(/blog\/post/)) {
            const pathAr = path.split("/");
            const findSlug = pathAr.pop();

            const post = postsMeta.find( ({ slug }) => slug === findSlug );
            if (post) {
                additionalProps = {
                    'image:image': post.coverImage
                };
            }
        }

        return {
            loc: path,
            changefreq: config.changefreq,
            priority: config.priority,
            lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
            ...additionalProps
        };
    },
}