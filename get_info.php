<?php
/** @noinspection PhpUnnecessaryLocalVariableInspection */
function update_devices(): array
{
    $handle = fopen("http://127.0.0.1:9118/v1/listRapidDiskVolumes", "r");
    $json_data = stream_get_contents($handle);
    fclose($handle);
    $device_data = json_decode($json_data, true);
    return $device_data;
}

$res = update_devices();
echo json_encode($res);
exit(0);
