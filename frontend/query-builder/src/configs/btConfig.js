import { BasicConfig } from "react-awesome-query-builder";

const initialConfig = BasicConfig

const btConfig = {
    ...initialConfig,
    fields: {
        event_id: {
            label: 'event_id',
            type: 'text'
        },
        lfv: {
            label: 'lfv',
            type: 'boolean'
        },
        fv: {
            label: 'fv',
            type: 'boolean'
        },
        swv: {
            label: 'swv',
            type: 'boolean'
        },
        id_non_offset: {
            label: 'id_non_offset',
            type: 'text'
        },
        rssi_non_offset: {
            label: 'rssi_non_offset',
            type: 'number'
        },
        id_azimuth: {
            label: 'id_azimuth',
            type: 'text'
        },
        rssi_azimuth: {
            label: 'rssi_azimuth',
            type: 'number'
        },
        id_elevation: {
            label: 'id_elevation',
            type: 'text'
        },
        rssi_elevation: {
            label: 'rssi_elevation',
            type: 'number'
        },
        timer: {
            label: 'timer',
            type: 'number'
        },
        event_type: {
            label: 'event_type',
            type: 'text'
        },
        channel: {
            label: 'channel',
            type: 'number'
        },
        tbd_1: {
            label: 'tbd_1',
            type: 'text'
        },
        tbd_2: {
            label: 'tbd_2',
            type: 'text'
        },
        MAC_address_1: {
            label: 'MAC_address_1',
            type: 'text'
        },
        MAC_address_2: {
            label: 'MAC_address_2',
            type: 'text'
        },
        tx_power: {
            label: 'tx_power',
            type: 'number'
        },
        appearance: {
            label: 'appearance',
            type: 'text'
        },
        service_uuid: {
            label: 'service_uuid',
            type: 'number'
        },
        length: {
            label: 'length',
            type: 'number'
        },
        id: {
            label: 'id',
            type: 'text'
        },
        ts: {
            label: 'ts',
            type: 'number'
        },
        azimuth_angle: {
            label: 'azimuth_angle',
            type: 'number'
        },
        elevation_angle: {
            label: 'elevation_angle',
            type: 'number'
        },
        figure_of_merit: {
            label: 'figure_of_merit',
            type: 'number'
        },
        alert_type: {
            label: 'alert_type',
            type: 'number'
        },
        ssid: {
            label: 'ssid',
            type: 'number'
        },
        scene_related: {
            label: 'scene_related',
            type: 'boolean'
        },
        related_device: {
            label: 'related_device',
            type: 'boolean'
        },
        main_class: {
            label: 'main_class',
            type: 'text'
        },
        sub_class: {
            label: 'sub_class',
            type: 'text'
        },
        accuracy: {
            label: 'accuracy',
            type: 'number'
        },
        status_state: {
            label: 'status_state',
            type: 'text'
        },
        anount_of_relationships: {
            label: 'amounts_of_relationships',
            type: 'number'
        },
        is_3D: {
            label: 'is_3D',
            type: 'boolean'
        },
        elevation_antenna_orientation_deg: {
            label: 'elevation_antenna_orientation_deg',
            type: 'number'
        },
        azimuth_antenna_orientation_deg: {
            label: 'azimuth_antenna_orientation_deg',
            type: 'number'
        }
    }
}

export default btConfig;