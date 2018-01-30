<?php
/** indique si le débuguage est activé */
define('DEBUG', true);
define('DEBUG_TARGET', 'screen'); // console ou screen

//connexion à la db
define('DB_DBNAME'  , 'dtraparic_speedup');
define('DB_DSN'     , 'mysql:host=localhost;dbname=' . DB_DBNAME);
define('DB_USER'    , 'root');
define('DB_PWD'     , 'root');

?>
