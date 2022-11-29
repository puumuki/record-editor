import React from "react";
import { Track } from "../../types/types";
import TextField from "../TextField";
import { setTrackEditorModal, addTrack, updateTrack } from "./race-recorder-slice";
import { useAppDispatch } from "./hooks";
import TextArea from "../TextArea";

interface TrackEditorModalProps {
  showTrackEditorModal: boolean,
  trackEditorModalTrack: Track | null
}

export default function TrackEditorModel(props: TrackEditorModalProps) {

  const {showTrackEditorModal, trackEditorModalTrack} = props;

  const track:Track = trackEditorModalTrack ?  trackEditorModalTrack 
                                            : { id: null, name: '', description: '', records: [] };

  const dispatch = useAppDispatch();

  function onClose() {
    dispatch(setTrackEditorModal({
      showTrackEditorModal: false,
      trackEditorModalTrack: null
    }));    
  }  

  function onSaveClicked() {   
    if( trackEditorModalTrack?.id ) {
      dispatch(updateTrack({
        ...track,      
      }));
    } else {
      dispatch(addTrack({
        id: null,
        name: track.name,
        records: [],
        description: ''   
      }));
    }

  }

  function onFieldChanges(event:React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) {
    dispatch(setTrackEditorModal({
      showTrackEditorModal: true,
      trackEditorModalTrack: { 
        ...track, 
        [event.target.name]: event.target.value
      }
    }));     
  }

  const title = () => {
    if( trackEditorModalTrack?.id ) {
      return <span>Muokkaa - {trackEditorModalTrack.name}</span>
    } else {
      return <span>Luo uusi rata</span>
    }    
  };  

  console.log(track)

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
            <div className="row">
              <div className="col-12">
                <TextField label="Radan nimi" id="track-name" name="name" value={track.name} onChange={onFieldChanges}></TextField>
              </div>
              <div className="col-12 mt-3">
                <TextArea label="Radan kuvaus" id="track-description" name="description" value={track.description} onChange={onFieldChanges}></TextArea>    
              </div>              
            </div>
            
            
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