import {useMapEvents} from 'react-leaflet';

export default function LocationPicker({onSelect}) {
    useMapEvents({
        click(e){
            onSelect(e.latlng);
        }
    });
    return null;
}