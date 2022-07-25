import { BasicConfig } from "react-awesome-query-builder";

const initialConfig = BasicConfig

const wifiConfig = {
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
        noise_floor_1: {
            label: 'noise_floor_1',
            type: 'number'
        },
        rate_1: {
            label: 'rate_1',
            type: 'text'
        },
        signal_mode_1: {
            label: 'signal_mode_1',
            type: 'text'
        },
        ceb_1: {
            label: 'ceb_1',
            type: 'text'
        },
        mcs_1: {
            label: 'mcs_1',
            type: 'text'
        },
        fec_coding_1: {
            label: 'fec_coding_1',
            type: 'text'
        },
        rx_state_1: {
            label: 'rx_state_1',
            type: 'text'
        },
        noise_floor_2: {
            label: 'noise_floor_2',
            type: 'number'
        },
        rate_2: {
            label: 'rate_2',
            type: 'text'
        },
        signal_mode_2: {
            label: 'signal_mode_2',
            type: 'text'
        },
        ceb_2: {
            label: 'ceb_2',
            type: 'text'
        },
        mcs_2: {
            label: 'mcs_2',
            type: 'text'
        },
        fec_coding_2: {
            label: 'fec_coding_2',
            type: 'text'
        },
        rx_state_2: {
            label: 'rx_state_2',
            type: 'text'
        },
        noise_floor_3: {
            label: 'noise_floor_3',
            type: 'number'
        },
        rate_3: {
            label: 'rate_1',
            type: 'text'
        },
        signal_mode_3: {
            label: 'signal_mode_1',
            type: 'text'
        },
        ceb_3: {
            label: 'ceb_1',
            type: 'text'
        },
        mcs_3: {
            label: 'mcs_1',
            type: 'text'
        },
        fec_coding_3: {
            label: 'fec_coding_1',
            type: 'text'
        },
        rx_state_3: {
            label: 'rx_state_1',
            type: 'text'
        },
        channel: {
            label: 'channel',
            type: 'number'
        },
        secondary_channel: {
            label: 'secondary_channel',
            type: 'number'
        },
        type: {
            label: 'type',
            type: 'number'
        },
        sub_type: {
            label: 'sub_type',
            type: 'number'
        },
        to_ds: {
            label: 'to_ds',
            type: 'boolean'
        },
        from_ds: {
            label: 'from_ds',
            type: 'boolean'
        },
        more_frag: {
            label: 'more_frag',
            type: 'boolean'
        },
        retry: {
            label: 'retry',
            type: 'boolean'
        },
        power_managment: {
            label: 'power_managment',
            type: 'boolean'
        },
        more_data: {
            label: 'more_data',
            type: 'boolean'
        },
        wep: {
            label: 'wep',
            type: 'boolean'
        },
        strict: {
            label: 'strict',
            type: 'boolean'
        },
        frag: {
            label: 'frag',
            type: 'number'
        },
        seq: {
            label: 'seq',
            type: 'number'
        },
        MAC_address_1: {
            label: 'MAC_address_1',
            type: 'text'
        },
        MAC_address_2: {
            label: 'MAC_address_2',
            type: 'text'
        },
        MAC_address_12: {
            label: 'MAC_address_12',
            type: 'text'
        },
        MAC_address_22: {
            label: 'MAC_address_22',
            type: 'text'
        },
        timestamp: {
            label: 'timestamp',
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
            type: 'text'
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
        amounts_of_relationships: {
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

export default wifiConfig;