var db = require('../db_connection'); //reference of db_connection.js

var query = {
  pharmacies: function (callback) {
    return db.query("select * from farmacias_salto order by id", callback);
  },
  turn: function (id, callback) {
    return db.query("SELECT ft.TURNO_DESDE 	AS TURNO_DESDE, ft.TURNO_HASTA AS TURNO_HASTA, f.NOMBRE	AS FARMACIA, fr.NOMBRE	AS FARMACIA_REEMPLAZO, ft.ID AS ID, ft.ID_FARMACIA_REEMPLAZO AS ID_FARMACIA_REEMPLAZO FROM farmacias_turnos_salto ft INNER JOIN farmacias_salto f ON f.ID = ft.ID_FARMACIA LEFT JOIN farmacias_salto fr ON fr.ID = ft.ID_FARMACIA_REEMPLAZO WHERE ft.ID =?", [id], callback);
  },
  dates: function (date, callback) {
    return db.query("SELECT ft.TURNO_DESDE 	AS TURNO_DESDE, ft.TURNO_HASTA AS TURNO_HASTA, f.NOMBRE	AS FARMACIA, fr.NOMBRE	AS FARMACIA_REEMPLAZO, ft.ID AS ID, ft.ID_FARMACIA_REEMPLAZO AS ID_FARMACIA_REEMPLAZO FROM farmacias_turnos_salto ft INNER JOIN farmacias_salto f ON f.ID = ft.ID_FARMACIA LEFT JOIN farmacias_salto fr ON fr.ID = ft.ID_FARMACIA_REEMPLAZO WHERE DATE_FORMAT(date(ft.TURNO_DESDE),'%m/%Y')='?' ORDER BY ft.TURNO_DESDE", [date], callback);
  },
  today: function (date, callback) {
    return db.query("SELECT ft.TURNO_DESDE AS TURNO_DESDE, ft.TURNO_HASTA 	AS TURNO_HASTA, COALESCE(fr.NOMBRE, f.NOMBRE) AS NOMBRE, COALESCE(fr.DIRECCION, f.DIRECCION) AS DIRECCION, COALESCE(fr.TELEFONO, f.TELEFONO) AS TELEFONO FROM farmacias_turnos_salto ft INNER JOIN farmacias_salto f ON f.ID = ft.ID_FARMACIA LEFT JOIN farmacias_salto fr ON fr.ID = ft.ID_FARMACIA_REEMPLAZO WHERE ? between ft.TURNO_DESDE and ft.TURNO_HASTA ORDER BY ft.TURNO_DESDE ", [date], callback);
  },
  update: function (ID_FARMACIA_REEMPLAZO, ID, callback){
    return db.query("UPDATE farmacias_turnos_salto SET ID_FARMACIA_REEMPLAZO=? WHERE ID =?", [ID_FARMACIA_REEMPLAZO, ID] ,callback)
  }
  // getById: function (id, callback) {
  //   return db.query("select * from task where Id=?", [id], callback);
  // },
  // add: function (task, callback) {
  //   return db.query("Insert into task values(?,?,?)", [task.Id, task.Title, task.Status], callback);
  // },
  // delete: function (id, callback) {
  //   return db.query("delete from task where Id=?", [id], callback);
  // },
  // update: function (id, task, callback) {
  //   return db.query("update task set Title=?,Status=? where Id=?", [task.Title, task.Status, id], callback);
  // }

};
module.exports = query;