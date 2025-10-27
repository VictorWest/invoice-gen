'use client';

import { ImageKitProvider, IKUpload } from "imagekitio-next";
import styles from "../page.module.css";
import { useState, useEffect, useRef, useCallback } from "react";
import { UseInvoiceContext } from "@/context/InvoiceContext";
import { useSearchParams, useRouter } from "next/navigation";

export default function ImageUpload() {
  const router = useRouter()
  const invoiceId = useSearchParams().get("invoice-id")

  const { setUploadedImage, handleSaveImageToDB } = UseInvoiceContext()

  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [uploadStats, setUploadStats] = useState({ loaded: 0, total: 0 });
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const ikUploadRef = useRef(null)

  // This function fires a "change" event on the IKUpload's internal <input> element
  const uploadViaIkSdk = useCallback((files) => {
    if (ikUploadRef?.current) {
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        'files').set;
      nativeInputValueSetter.call(ikUploadRef.current, files);
      const changeEvent = new Event('change', { bubbles: true });
      ikUploadRef.current.dispatchEvent(changeEvent);
    }
  }, [ikUploadRef])

  // Call our backend API to generate short-lived authentication credentials using our ImageKit API key
  const authenticator = async () => {
    try {
      const response = await fetch("/api/image-upload");
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Request failed with status ${response.status}: ${errorText}`);
      }
  
      const data = await response.json();
      const { signature, expire, token } = data;
      return { signature, expire, token };
    } catch (error) {
      throw new Error(`Authentication request failed: ${error.message}`);
    }
  };

  // This function now calls 'uploadViaSdk' to trigger the "change" event on IKUpload
  useEffect(() => {
    const handlePaste = (e) => {
      e.preventDefault();
      const files = e.clipboardData?.files;
      
      if (!files || files.length === 0) return;

      uploadViaIkSdk(files)
    };

    window.addEventListener('paste', handlePaste);

    return () => {
      window.removeEventListener('paste', handlePaste);
    };
  }, []);

  // event handlers for IKUpload: onError, onProgress, and onSuccess
  const onError = (err) => {
    setUploadStatus('error');
    setUploadProgress(0);
    setIsUploading(false);
  };
  
  const onProgress = (e) => {
    if (e.lengthComputable) {
      const progress = (e.loaded / e.total) * 100;
      setUploadProgress(progress);
      setUploadStats({
        loaded: e.loaded,
        total: e.total
      });
    }
  };

  const onSuccess = async (res) => {
    setIsUploading(false);
    setUploadStatus('success');
    setUploadProgress(100);

    const data = {
      url: res.url,
      fileId: res.fileId,
      invoiceId: invoiceId
    }

    setUploadedImage(data)
    await handleSaveImageToDB(data)
    
    router.back()
  };

  const resetUpload = () => {
    setUploadProgress(0);
    setUploadStatus(null);
    setIsUploading(false);
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 KB';
    const k = 1024;
    return `${(bytes / k).toFixed(1)} KB`;
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  // This function now calls 'uploadViaSdk' to trigger the "change" event on IKUpload
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    uploadViaIkSdk(e.dataTransfer.files)
  };

  return (
    // The main <div> is wrapped under this provider to make ImageKit-related variables available
    <ImageKitProvider
      publicKey={process.env.NEXT_PUBLIC_PUBLIC_KEY}
      urlEndpoint={process.env.NEXT_PUBLIC_URL_ENDPOINT}
      authenticator={authenticator} 
    >
      {/* The <IKUpload> is internally simply an <input> file picker. But since we have our own three upload UI interfaces, ...
      ... we hide the <IKUpload> element, and just reference it to manually trigger a “change“ event on it. */}
      <IKUpload
        onError={onError}
        onSuccess={onSuccess}
        onUploadProgress={onProgress}
        // we use this ref to manually trigger the "change" event on this element
        ref={ikUploadRef}
        style={{visibility: 'hidden', height: 0, width: 0}} // hide the default button
      />
      <div 
        className={styles.page}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {ikUploadRef && (
          <>
            {isDragging && !isUploading && (
              <div className={styles.dropZone}>
                <div className={styles.dropZoneContent}>
                  Drop your file here
                </div>
              </div>
            )}
            <div className="w-full flex justify-center">
            <main className="">
                <div className={`${styles.uploadArea} ${isUploading ? styles.disabled : ''} ${(uploadProgress > 0 || uploadStatus) ? styles.withProgress : ''}`}>
                  <p className={styles.uploadText}>
                    Drag and drop your file here<br />
                    <span>or</span>
                  </p>
                  <p className={styles.uploadHint}>
                    You can also paste files using Ctrl+V / Cmd+V
                  </p>
                  <label className={`${styles.fileInputLabel} ${isUploading ? styles.disabled : ''}`}>
                    <input
                      type="file" 
                      name="file"
                      className={styles.fileInput}
                      disabled={isUploading}
                      // This function now calls 'uploadViaSdk' to trigger the "change" event on IKUpload
                      onChange={(e) => {
                        e.stopPropagation()
                        e.preventDefault()
                        uploadViaIkSdk(e.target.files)
                      }}
                    />
                    Choose a file
                  </label>
                  
                  {(uploadProgress > 0 || uploadStatus) && (
                    <div className={styles.uploadProgress}>
                      {uploadStatus ? (
                        <div className={`${styles.uploadStatus} ${styles[uploadStatus]}`}>
                          {uploadStatus === 'success' ? (
                            <>
                              <p>✓ Upload completed successfully!</p>
                              {/* <button type="button" className={styles.restartButton} onClick={resetUpload}>
                                ↺ Upload another file
                              </button> */}
                            </>
                          ) : (
                            <>
                              <p>✕ Upload failed. Please try again.</p>
                              <button type="button" className={styles.restartButton} onClick={resetUpload}>
                                ↺ Try again
                              </button>
                            </>
                          )}
                        </div>
                      ) : (
                        <>
                          <div className={styles.uploadProgressHeader}>
                            <div className={styles.fileIcon}>📄</div>
                            <div>Uploading...</div>
                          </div>
                          <div className={styles.progressContainer}>
                            <div 
                              className={styles.progressBar} 
                              style={{ width: `${uploadProgress}%` }}
                            />
                          </div>
                          <div className={styles.progressStats}>
                            <span>{formatBytes(uploadStats.loaded)} / {formatBytes(uploadStats.total)}</span>
                            <span>{Math.round(uploadProgress)}%</span>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </main>              
            </div>
 
          </>
        )}
      </div>
    </ImageKitProvider>
  );
}