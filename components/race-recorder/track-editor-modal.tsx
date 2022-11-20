import React from "react";
import { Track } from "../../types/types";
import TextField from "../text-field";
import { setTrackEditorModal, addTrack, updateTrack } from "./race-recorder-slice";
import { useAppDispatch } from "./hooks";

export interface TrackEditorModalProps {
  showTrackEditorModal: boolean,
  trackEditorModalTrack?: Track
}

export default function TrackEditorModel(props: TrackEditorModalProps) {

  const {showTrackEditorModal, trackEditorModalTrack={ id: null, name: '', records: []}} = props;

  const dispatch = useAppDispatch();

  function onClose() {
    dispatch(setTrackEditorModal({
      showTrackEditorModal: false,
      trackEditorModalTrack: null
    }));    
  }  

  function onSaveClicked() {   
    if( trackEditorModalTrack.id ) {
      dispatch(updateTrack({
        ...trackEditorModalTrack,      
      }));
    } else {
      dispatch(addTrack({
        ...trackEditorModalTrack,      
      }));
    }

  }

  function onTrackNameChanges(event:React.ChangeEvent<HTMLInputElement>) {
    dispatch(setTrackEditorModal({
      showTrackEditorModal: true,
      trackEditorModalTrack: { ...trackEditorModalTrack, name: event.target.value }
    }));     
  }

  const title = () => {
    if( trackEditorModalTrack?.id ) {
      return <span>Muokkaa - {trackEditorModalTrack.name}</span>
    } else {
      return <span>Luo uusi rata</span>
    }    
  };  

  return (
    <dialog className={`modal fade ${showTrackEditorModal ? 'show' : ''}`} tabIndex={-1} role="dialog">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            
            <h5 className="modal-title">{title()}</h5>

            <button type="button" className="close" onClick={onClose} aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>

          <div className="modal-body">
            <TextField label="Radan nimi" id="track-name" name="track-name" value={trackEditorModalTrack?.name} onChange={onTrackNameChanges}></TextField>
          </div>


          <div className="modal-footer">
            <button type="button" className="btn btn-primary" onClick={onSaveClicked}>Tallenna</button>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Peruuta</button>
          </div>
        </div>

      </div>
    </dialog>
  );
}