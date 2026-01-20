package org.curiouslearning.container.presentation.adapters;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.ImageView;
import android.widget.TextView;

import org.curiouslearning.container.R;

import java.util.List;
import java.util.Map;

/**
 * Lightweight adapter for language dropdown with pill-shaped items and selected state styling.
 * Only handles visual styling - no logic changes to data or selection.
 */
public class LanguageDropdownAdapter extends ArrayAdapter<String> {
    private final Map<String, String> languagesEnglishNameMap;
    private String selectedLanguage;

    public LanguageDropdownAdapter(Context context, List<String> languages, Map<String, String> languagesEnglishNameMap) {
        super(context, R.layout.dropdown_item_pill, languages);
        this.languagesEnglishNameMap = languagesEnglishNameMap;
    }

    public void setSelectedLanguage(String selectedLanguage) {
        this.selectedLanguage = selectedLanguage;
        notifyDataSetChanged();
    }

    @Override
    public View getView(int position, View convertView, ViewGroup parent) {
        if (convertView == null) {
            convertView = LayoutInflater.from(getContext()).inflate(R.layout.dropdown_item_pill, parent, false);
        }

        String languageDisplayName = getItem(position);
        TextView textView = convertView.findViewById(android.R.id.text1);
        ImageView checkmark = convertView.findViewById(R.id.checkmark);

        textView.setText(languageDisplayName);

        // Determine if this item is selected
        String languageCode = languagesEnglishNameMap.get(languageDisplayName);
        boolean isSelected = selectedLanguage != null && selectedLanguage.equals(languageCode);

        if (isSelected) {
            // Selected: purple background, white text, show checkmark
            convertView.setBackgroundResource(R.drawable.dropdown_item_pill_selected);
            textView.setTextColor(0xFFFFFFFF);
            checkmark.setVisibility(View.VISIBLE);
        } else {
            // Default: light purple background, black text, hide checkmark
            convertView.setBackgroundResource(R.drawable.dropdown_item_pill_default);
            textView.setTextColor(0xFF000000);
            checkmark.setVisibility(View.GONE);
        }

        return convertView;
    }
}
