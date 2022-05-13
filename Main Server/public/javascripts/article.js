/**
 * article class used when storing a article in IDB
 */
class Article{
    title;
    image;
    description;
    author_name;
    date_of_issue;

    constructor(title, image, description, author_name, date_of_issue) {
        this.title = title;
        this.image = image;
        this.author_name = author_name;
        this.date_of_issue = date_of_issue;
    }
}