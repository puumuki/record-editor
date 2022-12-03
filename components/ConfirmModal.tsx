import React from "react";

export interface ConfirmModalProps {  
  title: string,
  text: string,
  confirmCallBack: React.MouseEventHandler,
  onCloseCallBack: React.MouseEventHandler
}

export default function ConfirmModal(props: ConfirmModalProps) {

  const {title, text, confirmCallBack, onCloseCallBack} = props;

  return (
    <dialog className="modal fade show"  tabIndex={-1} role="dialog">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            
            <h5 className="modal-title">{title}</h5>

            <button type="button" className="close" onClick={onCloseCallBack} aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>

          <div className="modal-body">
            <p>{text}</p>
          </div>


          <div className="modal-footer">
            <button type="button" className="btn btn-warning" onClick={confirmCallBack}>Kyllä</button>
            <button type="button" className="btn btn-secondary" onClick={onCloseCallBack}>Peruuta</button>
          </div>
        </div>

      </div>
    </dialog>
  );
}