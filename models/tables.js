const tables = `
CREATE TABLE IF NOT EXISTS users (
    userid INTEGER PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    is_admin INTEGER DEFAULT 0,
    created_date DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS projects(
    projectid INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS education(
    educationid INTEGER PRIMARY KEY,
    degree TEXT NOT NULL,
    school TEXT NOT NULL,
    department TEXT NOT NULL,
    thesis TEXT,
    year_finished TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS skills(
    skillid INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS blogs(
    blogid INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    keywords TEXT NOT NULL,
    summary TEXT NOT NULL,
    author TEXT NOT NULL,
    content TEXT NOT NULL,
    posted_date DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS comments(
    commentid INTEGER PRIMARY KEY,
    commenter text NOT NULL,
    blog INTEGER,
    comment TEXT NOT NULL,
    FOREIGN KEY (blog) REFERENCES blogs(blogid) ON DELETE CASCADE
);

`;

module.exports = tables;
