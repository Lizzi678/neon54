<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $to = "Neon54.nsk@yandex.ru";
    $subject = "Новая заявка на расчет (Квиз НЕОН54)";
    
    $type = htmlspecialchars($_POST['type']);
    $location = htmlspecialchars($_POST['location']);
    $size = htmlspecialchars($_POST['size']);
    $desc = htmlspecialchars($_POST['desc']);
    $phone = htmlspecialchars($_POST['phone']);
    $messenger = htmlspecialchars($_POST['messenger']);
    
    $message = "Новая заявка с квиза NEON54:\n\n";
    $message .= "Тип вывески: " . $type . "\n";
    $message .= "Место размещения: " . $location . "\n";
    $message .= "Размер: " . $size . "\n";
    $message .= "Описание / Пожелания: " . $desc . "\n";
    $message .= "Телефон: " . $phone . "\n";
    $message .= "Предпочтительная связь: " . $messenger . "\n";
    
    $headers = "From: noreply@" . $_SERVER['HTTP_HOST'] . "\r\n" .
               "Reply-to: " . $phone . "\r\n" .
               "Content-Type: text/plain; charset=utf-8\r\n";
               
    if (mail($to, $subject, $message, $headers)) {
        echo json_encode(["status" => "success"]);
    } else {
        echo json_encode(["status" => "error"]);
    }
}
?>