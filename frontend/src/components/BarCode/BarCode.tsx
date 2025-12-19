import Barcode from 'react-barcode';

type ReaderBarcodeProps = {
    readerCode?: string;
};

export default function ReaderBarcode({ readerCode }: ReaderBarcodeProps) {
    const code = readerCode || '000000';

    return (
        <div className="reader-barcode">
            <Barcode
                value={code}
                format="CODE128"
                width={2}
                height={60}
                displayValue={false}
                background="#f5f5f5"
                lineColor="#000000"
                margin={10}
                fontSize={0}
            />
            <p className="reader-barcode-text">{code}</p>
        </div>
    );
}