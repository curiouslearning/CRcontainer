package org.curiouslearning.container.util;

import android.graphics.Bitmap;
import android.widget.ImageView;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.robolectric.RobolectricTestRunner;
import org.robolectric.annotation.Config;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

@RunWith(RobolectricTestRunner.class)
@Config(sdk = {28})
public class QRCodeUtilTest {

    @Mock
    private ImageView mockImageView;

    @Before
    public void setup() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testGenerateQRCode_withValidText_setsImageBitmap() {
        QRCodeUtil.generateQRCode("test-id", mockImageView);
        verify(mockImageView).setImageBitmap(any(Bitmap.class));
    }

    @Test
    public void testGenerateQRCode_withNullText_doesNotSetImageBitmap() {
        QRCodeUtil.generateQRCode(null, mockImageView);
        verify(mockImageView, never()).setImageBitmap(any(Bitmap.class));
    }

    @Test
    public void testGenerateQRCode_withEmptyText_doesNotSetImageBitmap() {
        QRCodeUtil.generateQRCode("", mockImageView);
        verify(mockImageView, never()).setImageBitmap(any(Bitmap.class));
    }

    @Test
    public void testGenerateQRCode_withNullImageView_doesNothing() {
        // Should not crash or throw exception
        QRCodeUtil.generateQRCode("test-id", null);
    }
}
