const express = require('express');
const router  = express.Router();
const moment = require('moment');

module.exports = (db) => {
  router.get("/:storyId", (req, res) => {

    // TEMPL SHOULD REMOVE
    const userId = 1;

    const queryString = `
      SELECT title, 
      content,
      is_complete,
      photo_url,
      stories.created_at AS created_at,
      users.username AS username,
      owner_id,
      storyurl_id
      FROM stories
      JOIN users ON owner_id = users.id
      WHERE stories.storyurl_id = $1
    ;`;

    const queryParams = [
      req.params.storyId
    ];

    return db.query(queryString, queryParams)
      .then(data => {
        const results = data.rows[0];
        let isOwner = false;

        for (const row of data.rows) {
          row.created_at = moment(row.created_at).format("MMM Do");
        }

        if(results.is_complete){
          res.render('completestory',{story: results})
          res.end()
        }
        if(userId === data.rows[0].owner_id){
          isOwner = true;
        }
        if(!results.is_complete ){
          // console.log(isOwner)
        res.render('story', { story: results, isOwner})
        }
        
        
      })
  })

  return router;
}