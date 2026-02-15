const connection = require('../config/db');

class Portfolio {
    // Create or update artisan profile
    static async upsertArtisanProfile(artisanId, profileData) {
        const {
            name, profile_image, cover_image, tagline,
            location, email, phone, about,
            experience, specialization, language
        } = profileData;

        const sql = `
            INSERT INTO artisans (
                artisan_id, name, profile_image, cover_image,
                tagline, location, email, phone,
                about, experience, specialization, language
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
                name = VALUES(name),
                profile_image = VALUES(profile_image),
                cover_image = VALUES(cover_image),
                tagline = VALUES(tagline),
                location = VALUES(location),
                email = VALUES(email),
                phone = VALUES(phone),
                about = VALUES(about),
                experience = VALUES(experience),
                specialization = VALUES(specialization),
                language = VALUES(language)
        `;

        return new Promise((resolve, reject) => {
            connection.query(sql, [
                artisanId, name, profile_image, cover_image,
                tagline, location, email, phone,
                about, experience, specialization, language
            ], (err, result) => {
                if (err) reject(err);
                resolve(result);
            });
        });
    }

    // Add or update work
    static async upsertWork(workData) {
        const {
            work_id, artisan_id, title, category,
            description, image_urls, price_range,
            creation_date, available_for_order
        } = workData;

        const sql = `
            INSERT INTO works (
                work_id, artisan_id, title, category,
                description, image_urls, price_range,
                creation_date, available_for_order
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
                title = VALUES(title),
                category = VALUES(category),
                description = VALUES(description),
                image_urls = VALUES(image_urls),
                price_range = VALUES(price_range),
                creation_date = VALUES(creation_date),
                available_for_order = VALUES(available_for_order)
        `;

        return new Promise((resolve, reject) => {
            connection.query(sql, [
                work_id, artisan_id, title, category,
                description, JSON.stringify(image_urls), price_range,
                creation_date, available_for_order
            ], (err, result) => {
                if (err) reject(err);
                resolve(result);
            });
        });
    }

    // Add or update achievement
    static async upsertAchievement(achievementData) {
        const {
            achievement_id, artisan_id, title,
            year, description, award_image
        } = achievementData;

        const sql = `
            INSERT INTO achievements (
                achievement_id, artisan_id, title,
                year, description, award_image
            ) VALUES (?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
                title = VALUES(title),
                year = VALUES(year),
                description = VALUES(description),
                award_image = VALUES(award_image)
        `;

        return new Promise((resolve, reject) => {
            connection.query(sql, [
                achievement_id, artisan_id, title,
                year, description, award_image
            ], (err, result) => {
                if (err) reject(err);
                resolve(result);
            });
        });
    }

    // Update social links
    static async upsertSocialLinks(artisanId, socialData) {
        const { instagram, facebook, youtube, website } = socialData;

        const sql = `
            INSERT INTO social_links (
                artisan_id, instagram, facebook,
                youtube, website
            ) VALUES (?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
                instagram = VALUES(instagram),
                facebook = VALUES(facebook),
                youtube = VALUES(youtube),
                website = VALUES(website)
        `;

        return new Promise((resolve, reject) => {
            connection.query(sql, [
                artisanId, instagram, facebook,
                youtube, website
            ], (err, result) => {
                if (err) reject(err);
                resolve(result);
            });
        });
    }

    // Get complete portfolio by artisan ID
    static async getPortfolioByArtisanId(artisanId) {
        const sql = `
            SELECT 
                a.*,
                JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'work_id', w.work_id,
                        'title', w.title,
                        'category', w.category,
                        'description', w.description,
                        'image_urls', w.image_urls,
                        'price_range', w.price_range,
                        'creation_date', w.creation_date,
                        'available_for_order', w.available_for_order
                    )
                ) as works,
                JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'achievement_id', ach.achievement_id,
                        'title', ach.title,
                        'year', ach.year,
                        'description', ach.description,
                        'award_image', ach.award_image
                    )
                ) as achievements,
                sl.instagram, sl.facebook, sl.youtube, sl.website
            FROM artisans a
            LEFT JOIN works w ON a.artisan_id = w.artisan_id
            LEFT JOIN achievements ach ON a.artisan_id = ach.artisan_id
            LEFT JOIN social_links sl ON a.artisan_id = sl.artisan_id
            WHERE a.artisan_id = ?
            GROUP BY a.artisan_id
        `;

        return new Promise((resolve, reject) => {
            connection.query(sql, [artisanId], (err, result) => {
                if (err) reject(err);
                resolve(result[0]);
            });
        });
    }

    // Delete a work item
    static async deleteWork(workId, artisanId) {
        const sql = 'DELETE FROM works WHERE work_id = ? AND artisan_id = ?';
        
        return new Promise((resolve, reject) => {
            connection.query(sql, [workId, artisanId], (err, result) => {
                if (err) reject(err);
                resolve(result);
            });
        });
    }

    // Delete an achievement
    static async deleteAchievement(achievementId, artisanId) {
        const sql = 'DELETE FROM achievements WHERE achievement_id = ? AND artisan_id = ?';
        
        return new Promise((resolve, reject) => {
            connection.query(sql, [achievementId, artisanId], (err, result) => {
                if (err) reject(err);
                resolve(result);
            });
        });
    }
}

module.exports = Portfolio;
