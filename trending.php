<?php 
  
  //Get my app's access token
  $app_id = "xxx";
  $app_secret = "xxx";
  $app_token_url = "https://graph.facebook.com/oauth/access_token?"
    . "client_id=" . $app_id
    . "&client_secret=" . $app_secret 
    . "&grant_type=client_credentials";

  $response = file_get_contents($app_token_url);
  $params = null;
  parse_str($response, $params);

  //Search for restaurants near the center of the Short North
  $searchUrl = "https://graph.facebook.com/search?q=restaurant&type=place&center=39.977216,-83.003597&distance=500&limit=50&access_token=" . $params['access_token'];

  $searchArray = json_decode(file_get_contents($searchUrl));

  //Scrape/organize the relevant data
  foreach($searchArray->data as $key => $item)  {
    $locArray[$key]['name'] = $item->name;
    $locArray[$key]['latitude'] = $item->location->latitude;
    $locArray[$key]['longitude'] = $item->location->longitude;
    $locArray[$key]['id'] = $item->id;
  }
 
  //Build the JSON array used for the FB batch request
  foreach($locArray as $key => $item)  {
    $reqJSON = json_encode(array("method" => "GET", "relative_url" => strval($locArray[$key]['id']) . "/insights"));
    $reqArray[$key] = $reqJSON;  
  }
  
  $accessStr = ("access_token=" . strval($params['access_token']));   
  
  $reqString = implode(",", $reqArray);
  $reqFinal = ("batch=" . "[" . $reqString . "]");
 
  //Send the batch request
  $postUrl = ("https://graph.facebook.com/" . "?" . $accessStr . "&" . $reqFinal . "&method=post");
  
  $postArray = json_decode(file_get_contents($postUrl));

  //Scrape/organize the relevant data 
  foreach($postArray as $pkey => $pitem)  {
    $dataJSON = json_decode($postArray[$pkey]->body);
    $locArray[$pkey]['likes'] = $dataJSON->data[0]->values[0]->value->US;
  }
  
  //Send the info back to the client
  echo json_encode($locArray);
?>