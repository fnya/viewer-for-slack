/** @jsxImportSource @emotion/react */
import { jsx, css } from '@emotion/react';
import { File } from './File';
import { FileEntity } from '@fnya/common-entity-for-slack/entity/response/entity/FileEntity';
import { MyImage } from './Image';

export const Files = (props: any) => {
  // props
  const files: FileEntity[] = props.files;

  return (
    <>
      {files.map((file: FileEntity) => {
        return file?.mimeType === undefined ||
          file?.mimeType?.indexOf('image') === -1 ? (
          <File key={file.id} file={file} />
        ) : (
          <MyImage key={file.id} file={file} />
        );
      })}
    </>
  );
};
