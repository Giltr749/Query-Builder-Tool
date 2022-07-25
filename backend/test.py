import json

event_indexes = '{"wifi": {"0": "cluster","1": "sensor_id","2": "is_wifi","3": "event_id","4": "lfv","5": "fv","6": "swv","7": "id_non_offset","8": "rssi_non_offset","9": "id_azimuth","10": "rssi_azimuth","11": "id_elevation","12": "rssi_elevation","13": "timer","14": "event_type","15": "noise_floor_1","16": "rate_1","17": "sig_mode_1","18": "ceb_1","19": "mcs_1","20": "fec_coding_1","21": "rx_state_1","22": "noise_floor_2","23": "rate_2","24": "sig_mode_2","25": "ceb_2","26": "mcs_2","27": "fec_coding_2","28": "rx_state_2","29": "noise_floor_3","30": "rate_3","31": "sig_mode_3","32": "ceb_3","33": "mcs_3","34": "fec_coding_3","35": "rx_state_3","36": "channel","37": "secondary_channel","38": "type","39": "sub_type","40": "to_ds","41": "from_ds","42": "more_frag","43": "rerty","44": "power_managment","45": "more_data","46": "wep","47": "strict","48": "frag","49": "seq","50": "MAC_address_1","51": "MAC_address_2","52": "MAC_address_12","53": "MAC_address_22","54": "time_stamp","55": "azimuth_angle","56": "elevation_angle","57": "figure_of_merit","58": "alert_type","59": "ssid","60": "scene_related","61": "related_device","62": "main_class","63": "sub_class","64": "accuracy","65": "status_state","66": "amounts_of_relationships","67": "is_3D","68": "elevation_antenna_orientation_deg","69": "azimuth_antenna_orientation_deg" },"bluetooth": {"0": "cluster","1": "MAC","2": "is_wifi","3": "event_id","4": "lfv","5": "fv","6": "swv","7": "id_non_offset","8": "rssi_non_offset","9": "id_azimuth","10": "rssi_azimuth","11": "id_elevation","12": "rssi_elevation","13": "timer","14": "event_type","15": "channel","16": "tbd_1","17": "tbd_2","18": "MAC_address_1","19": "MAC_Address_2","20": "tx_power","21": "appearance","22": "service_uuid","23": "length","24": "id","25": "ts","26": "azimuth_angle","27": "elevation_angle","28": "figure_of_merit","29": "alert_type","30": "ssid","31": "scene_related","32": "related_device","33": "main_class","34": "sub_class","35": "accuracy","36": "status_state","37": "amount_of_relationships","38": "is_3D","39": "elevation_antenna_oreientation_deg","40": "azimuth_antenna_oreintation_deg"}}'

asdf = json.loads(event_indexes)

with open('event_indexes.json', 'w') as file:
    json.dump(asdf, file)
    print('Wrote to file')