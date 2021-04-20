DROP TABLE IF EXISTS mynew;

CREATE TABLE mynew (
    id serial not null primary key,
    country text,
    totalconfirmed text,
    totaldeaths text,
    totalrecovered text,
    thedate text
);

-- INSERT INTO mynew (country, totalconfirmed, totaldeaths,totalrecovered,thedate) VALUES ($1,$2,$3,$4,$5);
-- SELECT * FROM mynew;
-- DELETE FROM mynew WHERE id=$1;

-- UPDATE mynew SET country = $1, totalconfirmed = $2,totaldeaths = $3, totalrecovered = $4, thedate = $5 WHERE id=$6;