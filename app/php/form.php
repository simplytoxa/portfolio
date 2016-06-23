<?php

$name = $_POST['name'];
$email = $_POST['email'];
$validation = filter_var($email, FILTER_VALIDATE_EMAIL);
$textarea = $_POST['textarea'];

if((isset($name)&&$name!="")&&$validation&&(isset($textarea)&&$textarea!="")){
  $to = 'toxa.simply@gmail.com';
  $subject = 'Письмо из сайта-портфолио!';
   $message = '
                <html>
                    <head>
                        <title>'.$subject.'</title>
                    </head>
                    <body>
                        <p>Имя: '.$name.'</p>
                        <p>Email: '.$email.'</p>
                        <p>Сообщение: '.$textarea.'</p>                        
                    </body>
                </html>';
  $headers  = "Content-type: text/html; charset=utf-8 \r\n"; //Кодировка письма
  
  mail($to, $subject, $message, $headers);
}



?>