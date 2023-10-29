/** @jsxImportSource @emotion/react */
import { jsx, css } from '@emotion/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';

export const DeletedFile = () => {
  // css
  const deletedFileStyle = css`
    border-radius: 6px;
    border: 1px solid #d3d3d3;
    padding: 10px;
    margin: 10px;
    width: 320px;
  `;

  return (
    <div css={deletedFileStyle}>
      <FontAwesomeIcon icon={faTrashAlt} />
      このファイルは削除されました
    </div>
  );
};
