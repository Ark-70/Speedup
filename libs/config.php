<?php
/** indique si le débuguage est activé */
define('DEBUG', true);
define('DEBUG_TARGET', 'screen'); // console ou screen

//connexion à la db
define('DB_DBNAME'  , 'mmiangouetuds');
// define('DB_DSN'     , 'mmiangouetuds.mysql.db;dbname=' . DB_DBNAME);
// modification/ correction
define('DB_DSN'     , 'mysql:host=mmiangouetuds.mysql.db;dbname=' . DB_DBNAME);
define('DB_USER'    , 'mmiangouetuds');
define('DB_PWD'     , 'VSPDCgAfbTr7');

?>
