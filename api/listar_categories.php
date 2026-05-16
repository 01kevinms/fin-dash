<?php
require_once '_helpers.php';
cabecalhos();
$db = lerDB();
echo json_encode($db['categories'] ?? [], JSON_UNESCAPED_UNICODE);
