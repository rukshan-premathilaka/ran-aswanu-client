function RelatedProducts({ products = [], onSelect }) {
    return (
        <div className="w-full flex flex-col gap-4">
            <h2 className="text-xl font-bold text-gray-800">Related Products</h2>
            {products.length === 0 && <p className="text-gray-500 text-sm">No related products yet.</p>}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {products.map((product) => (
                    <div
                        key={product.id}
                        onClick={() => onSelect?.(product.id)}
                        className="border border-gray-100 rounded-xl p-3 flex flex-col gap-2 hover:shadow-md transition cursor-pointer"
                    >
                        {product.image ? (
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full aspect-square object-cover rounded-lg"
                            />
                        ) : (
                            <div className="w-full aspect-square rounded-lg bg-green-50" />
                        )}
                        <p className="text-sm font-medium text-gray-800 truncate">
                            {product.name}
                        </p>
                        <p className="text-sm font-bold text-green-600">
                            LKR {Number(product.price).toFixed(2)}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default RelatedProducts;