<?php
require_once '_helpers.php';
cabecalhos();
$db = lerDB();
echo json_encode($db['settings'] ?? [], JSON_UNESCAPED_UNICODE);
