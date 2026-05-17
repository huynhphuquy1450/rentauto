import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ImageUpload } from './ImageUpload';

vi.mock('react-toastify', () => ({
  toast: { error: vi.fn() },
}));

describe('<ImageUpload />', () => {
  it('renders upload prompt when no value', () => {
    render(<ImageUpload value="" onChange={() => {}} />);
    expect(screen.getByText(/Tải ảnh lên/)).toBeInTheDocument();
  });

  it('renders preview when value is provided', () => {
    render(<ImageUpload value="data:image/png;base64,test" onChange={() => {}} />);
    expect(screen.getByAltText('preview')).toBeInTheDocument();
  });

  it('rejects invalid mime type', async () => {
    const onChange = vi.fn();
    render(<ImageUpload value="" onChange={onChange} />);
    const input = screen.getByTestId('image-upload-input') as HTMLInputElement;
    const badFile = new File(['x'], 'doc.pdf', { type: 'application/pdf' });
    fireEvent.change(input, { target: { files: [badFile] } });
    await waitFor(() => {
      expect(screen.getByText(/Chỉ chấp nhận/)).toBeInTheDocument();
    });
    expect(onChange).not.toHaveBeenCalled();
  });

  it('rejects file larger than maxSizeMB', async () => {
    const onChange = vi.fn();
    render(<ImageUpload value="" onChange={onChange} maxSizeMB={1} />);
    const input = screen.getByTestId('image-upload-input') as HTMLInputElement;
    const bigBlob = new Uint8Array(2 * 1024 * 1024);
    const bigFile = new File([bigBlob], 'big.png', { type: 'image/png' });
    fireEvent.change(input, { target: { files: [bigFile] } });
    await waitFor(() => {
      expect(screen.getByText(/vượt quá 1MB/)).toBeInTheDocument();
    });
    expect(onChange).not.toHaveBeenCalled();
  });
});
