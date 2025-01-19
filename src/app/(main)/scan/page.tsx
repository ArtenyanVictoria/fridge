"use client";
import { useEffect, useState } from "react";
import {
    Scanner,
    useDevices,
    outline,
    boundingBox,
    centerText,
} from "@yudiel/react-qr-scanner";
import { useRouter } from "next/navigation";

export default function PageScan() {
    const [deviceId] = useState<string | undefined>(undefined);
    const [tracker] = useState<string | undefined>("centerText");
    const [pause, setPause] = useState(false);

    const devices = useDevices();
    const router = useRouter();

    useEffect(() => {
        console.log(devices)
    }, [devices])

    function getTracker() {
        switch (tracker) {
            case "outline":
                return outline;
            case "boundingBox":
                return boundingBox;
            case "centerText":
                return centerText;
            default:
                return undefined;
        }
    }

    const handleScan = async (data: string) => {
        setPause(true);
        try {
            const jsonData = JSON.parse(data);
            if (typeof jsonData === 'object' && jsonData !== null) {
                router.push('/scan/item?d=' + data)
            } else {
                console.log('Сканированный текст не является JSON-объектом');
            }
        } catch (error: unknown) {
            console.log(error);
        } finally {
            setPause(false);
        }
    };

    return (
        <div>
            {devices.length != 0 ?
                <Scanner
                    formats={[
                        "qr_code",
                        "micro_qr_code",
                        "rm_qr_code",
                        "maxi_code",
                        "pdf417",
                        "aztec",
                        "data_matrix",
                        "matrix_codes",
                        "dx_film_edge",
                        "databar",
                        "databar_expanded",
                        "codabar",
                        "code_39",
                        "code_93",
                        "code_128",
                        "ean_8",
                        "ean_13",
                        "itf",
                        "linear_codes",
                        "upc_a",
                        "upc_e",
                    ]}
                    constraints={{
                        deviceId: deviceId,
                    }}
                    onScan={(detectedCodes) => {
                        handleScan(detectedCodes[0].rawValue);
                    }}
                    onError={(error) => {
                        console.log(`onError: ${error}'`);
                    }}
                    styles={{ container: { height: "400px", width: "350px" } }}
                    components={{
                        audio: true,
                        onOff: true,
                        torch: true,
                        zoom: true,
                        finder: true,
                        tracker: getTracker(),
                    }}
                    // allowMultiple={true}
                    scanDelay={2000}
                    paused={pause}
                />
                :
                <div style={{ textAlign: "center", fontSize: "24px" }}>
                    <span className="text-red-500 text-3xl">Ошибка.</span><br />Не найдена камера
                </div>
            }
        </div>
    );
}
