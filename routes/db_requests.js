var express = require('express');
var router = express.Router();
var dbquery = require('../model/db_queries');
var debug = require('debug')('my-namespace')
var db = require('../db_connection'); //reference of db_connection.js

router.get('/pharmacies', function (req, res, next) {
  dbquery.pharmacies(function (err, rows) {
    if (err) {
      res.json(err);
    } else {
      //forma de mostrar en express
      // res.render('index.ejs', { title: '/pharmacies', jsonresponse: res.json(rows) });
      res.json(rows);
    }
  });
});

router.get('/turn/:id?', function (req, res, next) {
  dbquery.turn(req.params.id, function (err, rows) {
    if (err) {
      res.json(err);
    } else {
      //forma de mostrar en express
      // res.render('index.ejs', { title: '/turn', jsonresponse: res.json(rows) });
      //respuesta para frontend
      res.json(rows);
    }
  });
});

router.get('/today/:date1?/:date2?/:date3?', function (req, res, next) {
  debug("->>>>>>>>>/TODAY QUERY", req.query)
  debug("->>>>>>>>>/TODAY PARAMS", req.params)

  let todayTomorrowQuery = "SELECT ft.TURNO_DESDE AS TURNO_DESDE, ft.TURNO_HASTA 	AS TURNO_HASTA, COALESCE(fr.NOMBRE, f.NOMBRE) AS NOMBRE, COALESCE(fr.DIRECCION, f.DIRECCION) AS DIRECCION, COALESCE(fr.TELEFONO, f.TELEFONO) AS TELEFONO FROM farmacias_turnos_salto ft INNER JOIN farmacias_salto f ON f.ID = ft.ID_FARMACIA LEFT JOIN farmacias_salto fr ON fr.ID = ft.ID_FARMACIA_REEMPLAZO WHERE'" + req.params.date1 + "'between ft.TURNO_DESDE and ft.TURNO_HASTA UNION SELECT ft.TURNO_DESDE AS TURNO_DESDE, ft.TURNO_HASTA 	AS TURNO_HASTA, COALESCE(fr.NOMBRE, f.NOMBRE) AS NOMBRE, COALESCE(fr.DIRECCION, f.DIRECCION) AS DIRECCION, COALESCE(fr.TELEFONO, f.TELEFONO) AS TELEFONO FROM farmacias_turnos_salto ft INNER JOIN farmacias_salto f ON f.ID = ft.ID_FARMACIA LEFT JOIN farmacias_salto fr ON fr.ID = ft.ID_FARMACIA_REEMPLAZO WHERE'" + req.params.date2 + "'between ft.TURNO_DESDE and ft.TURNO_HASTA UNION SELECT ft.TURNO_DESDE AS TURNO_DESDE, ft.TURNO_HASTA 	AS TURNO_HASTA, COALESCE(fr.NOMBRE, f.NOMBRE) AS NOMBRE, COALESCE(fr.DIRECCION, f.DIRECCION) AS DIRECCION, COALESCE(fr.TELEFONO, f.TELEFONO) AS TELEFONO FROM farmacias_turnos_salto ft INNER JOIN farmacias_salto f ON f.ID = ft.ID_FARMACIA LEFT JOIN farmacias_salto fr ON fr.ID = ft.ID_FARMACIA_REEMPLAZO WHERE '" + req.params.date3 + "' between ft.TURNO_DESDE and ft.TURNO_HASTA";
  // let todayQuery = "SELECT ft.TURNO_DESDE AS TURNO_DESDE, ft.TURNO_HASTA 	AS TURNO_HASTA, COALESCE(fr.NOMBRE, f.NOMBRE) AS NOMBRE, COALESCE(fr.DIRECCION, f.DIRECCION) AS DIRECCION, COALESCE(fr.TELEFONO, f.TELEFONO) AS TELEFONO FROM farmacias_turnos_salto ft INNER JOIN farmacias_salto f ON f.ID = ft.ID_FARMACIA LEFT JOIN farmacias_salto fr ON fr.ID = ft.ID_FARMACIA_REEMPLAZO WHERE'" + req.query.date + "'between ft.TURNO_DESDE and ft.TURNO_HASTA ORDER BY ft.TURNO_DESDE";

  db.query(todayTomorrowQuery, (err, result) => {
    // dbquery.today(req.query.date, function (err, result) {
    if (err) {
      debug("->>>>>>>>>/TODAY ERR", JSON.parse(JSON.stringify(err)))
      res.json(err);
    } else {
      //forma de mostrar en express
      // res.render('index.ejs', { title: '/turn', jsonresponse: res.json(result) });
      //respuesta para frontend
      debug("->>>>>>>>>/TODAY RES", JSON.parse(JSON.stringify(result)));
      res.json(result);
    }
  });
});

// router.get('/update/:farmacia_reemplazo?/:id?', function (req, res, next) {
//   dbquery.update(req.params.farmacia_reemplazo,req.params.id, function (err, rows) {
//     if (err) {
//       res.json(err);
//     } else {
//       //respuesta para frontend
//       res.json(rows);
//     }
//   });
// });

router.put('/update/:farmacia_reemplazo?/:id?', function (req, res, next) {

  dbquery.update(req.params.farmacia_reemplazo, req.params.id, function (err, rows) {

    if (err) {
      res.json(err);
    } else {
      res.json(rows);
    }
  });
});

module.exports = router;