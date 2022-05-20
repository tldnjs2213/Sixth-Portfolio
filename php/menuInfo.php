<?php
  require './dbConnect.php';

  if($_POST['page'] == 'home'); {
    $sqlQuery = 'SELECT * FROM `menuTable`';
    if (!$records = mysqli_query($dbHandler, $sqlQuery)) {
      echo '<script>console.log("SQL Syntax Error...");</script>';
      exit;
    }
    if (mysqli_num_rows($records) == 0) {
      echo '<script>console.log("There is no any Data...");</script>';
      exit;
    }
  
    $arrMenuInfo = [];
    while($record = mysqli_fetch_array($records)) {
      $objMenuInfoItem = [
        'id' => $record['id'],
        'productName' => $record['productName'],
        'price' => $record['price'],
        'imageUrl' => $record['imageUrl']
      ];
      array_push($arrMenuInfo, $objMenuInfoItem);
    }
    $jsonMenuInfo = json_encode($arrMenuInfo);
    echo $jsonMenuInfo;
    mysqli_free_result($records);
    mysqli_close($dbHandler);
  }
?>