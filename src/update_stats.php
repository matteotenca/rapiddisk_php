<?php

/** @noinspection PhpUnnecessaryLocalVariableInspection */
function update_devices($action): array
{
    if ( $handle = fopen("http://127.0.0.1:9118/v1/listRapidDiskVolumes", "r")) {
        $json_data = stream_get_contents($handle);
        fclose($handle);
        $device_data = json_decode($json_data, true);
        if ($action != "all") {
            $device_data = $device_data["volumes"][1]["rapiddisk_cache"];
        }
        return $device_data;
    }
    return [];
}

function update_stats($dev): array
{
    if ($handle = fopen("http://127.0.0.1:9118/v1/showRapidDiskCacheStats/$dev", "r")) {
        $json_data = stream_get_contents($handle);
        fclose($handle);
        $json = json_decode($json_data, true);
        $stats = $json["statistics"][0]["cache_stats"][0];
        $read_data = array();
        $write_data = array();
        if (stristr($dev, '-wb')) {
            foreach ($stats as $key => $value) {
                $key = str_replace("num_", "", $key);
                if ($key == "device") {
                    continue;
                } elseif (stristr($key, "req") || stristr($key, "read") || stristr($key, "free")) {
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
                    continue;
                } elseif (stristr($key, "reads") && (!stristr($key, "cache_reads"))) {
                    $cache_data[] = array("y" => $value, "label" => str_replace("_", " ", $key));
                } elseif (stristr($key, "writes")) {
                    $read_data[] = array("y" => $value, "label" => str_replace("_", " ", $key));
                } elseif (stristr($key, "cache")) {
                    $write_data[] = array("y" => $value, "label" => str_replace("_", " ", $key));
                } else {
                    $other[] = array("y" => $value, "label" => str_replace("_", " ", $key));
                }
            }
            $json_array = [$cache_data, $read_data, $write_data, $other];
        }
    } else {
        $json_array = [];
    }

    return $json_array;
}

if (key_exists("devices", $_POST)) {
    $res = update_devices($_POST["devices"]);
} else if (key_exists("stats", $_POST)) {
    $res = update_stats($_POST["stats"]);
} else {
    $res = array();
}
if (sizeof($res) > 0) {
    echo json_encode($res, JSON_NUMERIC_CHECK);
}
exit(0);
