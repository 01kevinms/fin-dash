<?php
require_once '_helpers.php';
cabecalhos();
$db = lerDB();
echo json_encode($db['users'] ?? [], JSON_UNESCAPED_UNICODE);
