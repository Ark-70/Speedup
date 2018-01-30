<?php
/*
 Université POITIERS - IUT Angouleme
 CODE PAR DAVID TRAPARIC
 */
include('libs/configlocal.php');
include('libs/debug.php');
include('libs/functions.php');
$db = new PDO(DB_DSN, DB_USER, DB_PWD);
$db->exec("SET NAMES utf8");
// indicateur d'erreur
$error = false;
$error_message = '';

if (!empty($_POST)){
  $pseudo = str_replace("'","''",$_POST['pseudo']);
  $score = str_replace("'","''",$_POST['score']);
  $sql = "INSERT INTO dtraparic_scores (pseudo,score) VALUES('$pseudo','$score')";
  echo "<script>console.log(\"$sql\");</script>";
  $result = $db->exec($sql);
}

$sqlSelectScores = "SELECT `pseudo`,`score` FROM `dtraparic_scores` ORDER BY `dtraparic_scores`.score DESC LIMIT 10";
$scores = $db->query($sqlSelectScores)->fetchAll(PDO::FETCH_ASSOC);
?>
<!doctype html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>50 ans IUT admin</title>
  <link href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/css/bootstrap.min.css" rel="stylesheet">
  <style>
    html{
      padding-top:5px;
      padding-bottom:5px;
      text-align: center;
    }

    .container{
      position:relative;
      width:50%;
    }

    table{
      font-size: 0.92rem !important;
      border:1px solid gainsboro;
    }

    table td, table th{
      padding:0.45rem !important;
    }

    .dropmenu{
      display:inline-block;
      position:absolute;
      top:4px;
      left:-24px;
      -webkit-user-select:none;
      -moz-user-select:none;
      user-select:none;
      cursor:pointer;
    }

    .fusion{
      vertical-align: middle !important;
      font-weight: bold;
    }

    .fusion:first-of-type, .fusion:nth-of-type(2){
      background-color: gainsboro;
    }

    tr:nth-of-type(even){
      background-color: gainsboro;
    }

    .dropmenu>p{
      border:1px solid black;
      border-radius: 5px;
      text-align: center;
      display:inline-block;
      border:1px solid black;
      border-radius: 5px;
      width:26px;
      height:26px;
      line-height: 26px;
    }

    #tdetat{
      font-weight: bold;
    }
  </style>
</head>
<body>
  <div class="container titre">
    <h1>TABLEAU DES SCORES</h1>
  </div>
  <div class="container">
    <table class="table">
      <thead class="thead-inverse">
        <tr>
          <th style="text-align:center;">Pseudonyme</th>
          <th style="text-align:center;">Score</th>
        </tr>
      </thead>
      <tbody>

      <?php foreach($scores as $index => $thisScore) { ?>

        <form method="get">
          <tr>
            <td><?php echo $thisScore['pseudo']?></td>
            <td><?php echo $thisScore['score']?></td>
          </tr>
        </form>

      <?php } ?>

      </tbody>
    </table>
  </div>
</body>
