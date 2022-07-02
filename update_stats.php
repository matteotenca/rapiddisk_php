<?php

/** @noinspection PhpUnnecessaryLocalVariableInspection */
function update_devices(): array
{
    $handle = fopen("http://127.0.0.1:9118/v1/listRapidDiskVolumes", "r");
    $json_data = stream_get_contents($handle);
    fclose($handle);
    $device_data = json_decode($json_data, true);
    $device_data = $device_data["volumes"][1]["rapiddisk_cache"];
    return $device_data;
}

function update_stats($dev): array
{
    $handle = fopen("http://127.0.0.1:9118/v1/showRapidDiskCacheStats/{$dev}", "r");
    $json_data = stream_get_contents($handle);
    fclose($handle);
    $json = json_decode($json_data, true);
//print $json_data;
//print nl2br(print_r($json, true));
//print_r($json["statistics"][0]["cache_stats"][0]["device"]);
    $stats = $json["statistics"][0]["cache_stats"][0];
    $read_data = array();
    $write_data = array();
    if (str_contains($dev, '-wb')) {
        foreach ($stats as $key => $value) {
            $key = str_replace("num_", "", $key);
            if ($key == "device") {
                continue;
            } elseif (str_contains($key, "req") || str_contains($key, "read") || str_contains($key, "free")) {
                $write_data[] = array("y" => $value, "label" => str_replace("_", " ", $key));
            } else {
                $read_data[] = array("y" => $value, "label" => str_replace("_", " ", $key));
            }
        }
        $json_array = [$read_data, $write_data];
    } else {
        $cache_data = array();
        $other = array();
        foreach ($stats as $key => $value) {
            if ($key == "device") {
//            $device = $value;
                continue;
            } elseif (str_contains($key, "reads") && (!str_contains($key, "cache_reads"))) {
                $cache_data[] = array("y" => $value, "label" => str_replace("_", " ", $key));
            } elseif (str_contains($key, "writes")) {
                $read_data[] = array("y" => $value, "label" => str_replace("_", " ", $key));
            } elseif (str_contains($key, "cache")) {
                $write_data[] = array("y" => $value, "label" => str_replace("_", " ", $key));
            } else {
                $other[] = array("y" => $value, "label" => str_replace("_", " ", $key));
            }
//        $data[] = array("y" => $value, "label" => $key);
        }
        $json_array = [$cache_data, $read_data, $write_data, $other];
    }
    return $json_array;
}

if (key_exists("devices", $_POST)) {
    $res = update_devices();
} else if (key_exists("stats", $_POST)) {
    $res = update_stats($_POST["dev"]);
} else {
    $res = array();
}

//print_r($res);
echo json_encode($res,JSON_NUMERIC_CHECK);
exit(0);
