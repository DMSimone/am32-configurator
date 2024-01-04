import { Msp } from '~/src/communication/msp';
import { defineStore, acceptHMRUpdate } from 'pinia'

export const useSerialStore = defineStore('serial', () => {
    const hasConnection = ref(false)
    const hasSerial = ref(true)
    const isFourWay = ref(false)
    const pairedDevices = ref<SerialPort[]>([]);
    const pairedDevicesOptions = computed(() => pairedDevices.value.map(d =>
        ({ id: `${d.getInfo().usbVendorId}:${d.getInfo().usbProductId}`, label: `0x${padStr(d.getInfo().usbVendorId?.toString(16) ?? '', 4, '0')}:0x${padStr(d.getInfo().usbProductId?.toString(16) ?? '', 4, '0')}` }))
    );
    const selectedDevice = ref<{ id: string, label: string }>();
    const deviceHandles = ref<{
        port: SerialPort | null,
        reader: ReadableStreamDefaultReader | null,
        writer: WritableStreamDefaultWriter | null,
        msp: Msp | null,
    }>({
        port: null,
        reader: null,
        writer: null,
        msp: null,
    });

    const mspData = ref<MspData>({} as MspData);

    function setHasSerial(has: boolean) {
        hasSerial.value = has;
    }

    function addSerialDevices(devices: SerialPort[]) {
        pairedDevices.value = [
            ...devices
        ];
    }

    function selectLastDevice() {
        selectedDevice.value = pairedDevicesOptions.value[pairedDevicesOptions.value.length - 1];
    }
 
    return { mspData, isFourWay, hasConnection, setHasSerial, hasSerial, addSerialDevices, selectLastDevice, pairedDevices, pairedDevicesOptions, selectedDevice, deviceHandles }
})

export type SerialStore = ReturnType<typeof useSerialStore>

if (import.meta.hot) {
 import.meta.hot.accept(acceptHMRUpdate(useSerialStore, import.meta.hot))
}