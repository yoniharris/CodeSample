 -- All code by Yoni Harris
 -- Description: PostgreSQL view query which uses multi tenancy table to select tag data
 -- according the zone.
 
 SELECT "tbl_Tags".client_id,
    "tbl_Tags".subzone_id,
    ( SELECT max("tbl_Tags".last_seen) AS max) AS last_updated
   FROM "tbl_Tags"
  WHERE "tbl_Tags".client_id = ANY (ARRAY[current_setting('application_name'::text)::integer, 0])
  GROUP BY "tbl_Tags".client_id, "tbl_Tags".subzone_id
  ORDER BY (( SELECT max("tbl_Tags".last_seen) AS max)) DESC;
