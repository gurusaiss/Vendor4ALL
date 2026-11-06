import React, { useState } from 'react';
import { X, Check, Trash2 } from 'lucide-react';
import { ProduceItem, Language } from '../types';
import { translations } from '../utils/translations';

interface EditProductModalProps {
  product: ProduceItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedProduct: ProduceItem) => void;
  onDelete: (id: string) => void;
  lang: Language;
}

export const EditProductModal: React.FC<EditProductModalProps> = ({
  product,
  isOpen,
  onClose,
  onSave,
  onDelete,
  lang,
}) => {
  if (!isOpen || !product) return null;

  const t = translations[lang];

  const [nameEn, setNameEn] = useState(product.name_en);
  const [nameTe, setNameTe] = useState(product.name_te);
  const [price, setPrice] = useState(product.price.toString());
  const [priceUnit, setPriceUnit] = useState(product.price_unit);
  const [quantity, setQuantity] = useState(product.quantity.toString());
  const [unit, setUnit] = useState(product.unit);
  const [availability, setAvailability] = useState(product.availability);
  const [category, setCategory] = useState(product.category);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedPrice = parseFloat(price) || 0;
    const parsedQuantity = parseFloat(quantity) || 0;

    const updated: ProduceItem = {
      ...product,
      name_en: nameEn.trim(),
      name_te: nameTe.trim(),
      price: parsedPrice,
      price_unit: priceUnit,
      quantity: parsedQuantity,
      unit,
      availability: parsedQuantity === 0 ? 'sold_out' : availability,
      category,
      is_demo: false, // Transition from demo to active vendor-modified record
      last_updated: `Today, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
    };

    onSave(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 overflow-y-auto max-h-[90vh]">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              {lang === 'te' ? 'సరుకు వివరాలను సవరించండి' : 'Edit Produce Details'}
            </h3>
            <p className="text-xs text-slate-500">{product.name_en} • {product.location}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Close edit modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Name Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t.fieldProduceNameEn}
              </label>
              <input
                type="text"
                value={nameEn}
                onChange={(e) => setNameEn(e.target.value)}
                required
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t.fieldProduceNameTe}
              </label>
              <input
                type="text"
                value={nameTe}
                onChange={(e) => setNameTe(e.target.value)}
                required
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none font-telugu"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {t.fieldCategory}
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
            >
              <option value="vegetables">{t.filterVegetables}</option>
              <option value="fruits">{t.filterFruits}</option>
              <option value="greens">{t.filterGreens}</option>
              <option value="other">{t.filterOther}</option>
            </select>
          </div>

          {/* Price & Price Unit */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t.fieldPrice}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-slate-400 font-bold text-sm">₹</span>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  className="w-full text-sm pl-7 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none font-bold"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t.fieldPriceUnit}
              </label>
              <select
                value={priceUnit}
                onChange={(e) => setPriceUnit(e.target.value)}
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
              >
                <option value="kg">kg (కిలో)</option>
                <option value="bunch">bunch (కట్ట)</option>
                <option value="piece">piece (ముక్క / కాయ)</option>
                <option value="dozen">dozen (డజను)</option>
                <option value="250g">250 grams</option>
              </select>
            </div>
          </div>

          {/* Quantity & Unit */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t.fieldQuantity}
              </label>
              <input
                type="number"
                min="0"
                step="any"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t.fieldUnit}
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
              >
                <option value="kg">kg (కిలో)</option>
                <option value="bunch">bunch (కట్ట)</option>
                <option value="piece">piece (కాయ)</option>
                <option value="dozen">dozen (డజను)</option>
              </select>
            </div>
          </div>

          {/* Availability Status */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {t.fieldAvailability}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setAvailability('available')}
                className={`py-2 px-3 rounded-lg text-xs font-bold border transition-colors flex items-center justify-center gap-1.5 ${
                  availability === 'available'
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-400'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                <span>{t.inStockBadge}</span>
              </button>
              <button
                type="button"
                onClick={() => setAvailability('sold_out')}
                className={`py-2 px-3 rounded-lg text-xs font-bold border transition-colors flex items-center justify-center gap-1.5 ${
                  availability === 'sold_out'
                    ? 'bg-rose-100 text-rose-800 border-rose-400'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-rose-600"></span>
                <span>{t.soldOutBadge}</span>
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-6">
            <button
              type="button"
              onClick={() => {
                if (window.confirm(lang === 'te' ? 'ఈ సరుకును తొలగించాలనుకుంటున్నారా?' : 'Delete this produce listing?')) {
                  onDelete(product.id);
                  onClose();
                }
              }}
              className="flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-700 font-semibold p-2 rounded-lg hover:bg-rose-50"
            >
              <Trash2 className="w-4 h-4" />
              <span>{t.deleteProduce}</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                {t.cancelBtn}
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
              >
                <Check className="w-4 h-4" />
                <span>{lang === 'te' ? 'సేవ్ చేయండి' : 'Save Changes'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
