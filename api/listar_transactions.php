<?php
require_once '_helpers.php';
cabecalhos();
$db = lerDB();
echo json_encode($db['transactions'] ?? [], JSON_UNESCAPED_UNICODE);
