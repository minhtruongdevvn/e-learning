CREATE MATERIALIZED VIEW "MCourseRating" AS
SELECT "courseId", AVG(rating) AS "avgRating"
FROM "CourseRating"
GROUP BY "courseId";